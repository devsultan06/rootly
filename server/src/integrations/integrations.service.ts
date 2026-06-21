import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConnectGithubDto } from './dto/connect-github.dto';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private async getWorkspaceIdForUser(adminClient: any, userId: string): Promise<string> {
    const { data: membership, error } = await adminClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('profile_id', userId)
      .limit(1)
      .maybeSingle();

    if (error || !membership) {
      this.logger.error(`Could not find workspace membership for user ${userId}: ${error?.message}`);
      throw new BadRequestException('User is not associated with any workspace');
    }

    return membership.workspace_id;
  }

  async getIntegrations(user: any) {
    const userId = user.sub || user.id;
    const adminClient = this.supabaseService.getAdminClient();
    const workspaceId = await this.getWorkspaceIdForUser(adminClient, userId);

    const { data: integrations, error } = await adminClient
      .from('integrations')
      .select('provider, is_active, last_sync')
      .eq('workspace_id', workspaceId);

    if (error) {
      this.logger.error(`Failed to fetch integrations: ${error.message}`);
      return [];
    }

    return integrations || [];
  }

  async connectGithub(user: any, dto: ConnectGithubDto) {
    const userId = user.sub || user.id;
    const adminClient = this.supabaseService.getAdminClient();
    const workspaceId = await this.getWorkspaceIdForUser(adminClient, userId);

    if (!dto.token || dto.token.trim() === '') {
      throw new BadRequestException('GitHub Personal Access Token is required');
    }

    // 1. Validate the token against GitHub API
    this.logger.log(`Validating GitHub PAT for workspace ${workspaceId}`);
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${dto.token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Rootly-App',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`GitHub PAT validation failed with status ${response.status}: ${errorText}`);
        throw new BadRequestException('Invalid GitHub Personal Access Token');
      }

      const githubUser = await response.json();
      this.logger.log(`Successfully validated GitHub PAT. Username: ${githubUser.login}`);
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`GitHub API contact error: ${err.message}`);
      throw new BadRequestException('Could not connect to GitHub API. Please check network or token.');
    }

    // 2. Save credentials to DB (upsert)
    const { error: upsertError } = await adminClient
      .from('integrations')
      .upsert(
        {
          workspace_id: workspaceId,
          provider: 'github',
          credentials: { token: dto.token },
          is_active: true,
          last_sync: new Date().toISOString(),
        },
        { onConflict: 'workspace_id,provider' }
      );

    if (upsertError) {
      this.logger.error(`Failed to upsert GitHub integration: ${upsertError.message}`);
      throw new BadRequestException('Failed to save integration settings');
    }

    return { success: true, message: 'GitHub connected successfully.' };
  }

  async syncGithub(user: any) {
    const userId = user.sub || user.id;
    const adminClient = this.supabaseService.getAdminClient();
    const workspaceId = await this.getWorkspaceIdForUser(adminClient, userId);

    // 1. Get github integration credentials
    const { data: integration, error: integrationError } = await adminClient
      .from('integrations')
      .select('credentials, is_active')
      .eq('workspace_id', workspaceId)
      .eq('provider', 'github')
      .maybeSingle();

    if (integrationError || !integration || !integration.is_active) {
      throw new BadRequestException('GitHub integration is not connected or inactive');
    }

    const token = (integration.credentials as any)?.token;
    if (!token) {
      throw new BadRequestException('GitHub token not found. Please reconnect.');
    }

    // 2. Fetch all projects in this workspace that have a github_repo linked
    const { data: projects, error: projectsError } = await adminClient
      .from('projects')
      .select('id, name, github_repo')
      .eq('workspace_id', workspaceId);

    if (projectsError) {
      this.logger.error(`Failed to fetch workspace projects: ${projectsError.message}`);
      throw new BadRequestException('Failed to fetch projects for sync');
    }

    const projectsToSync = (projects || []).filter(p => p.github_repo);
    if (projectsToSync.length === 0) {
      return { success: true, syncedProjectsCount: 0, message: 'No projects with linked GitHub repositories found.' };
    }

    let totalSyncedCommits = 0;

    for (const project of projectsToSync) {
      this.logger.log(`Syncing commits for project: ${project.name} (${project.github_repo})`);
      try {
        const response = await fetch(`https://api.github.com/repos/${project.github_repo}/commits?per_page=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Rootly-App',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.warn(`Failed to fetch commits for ${project.github_repo}: ${response.status} - ${errorText}`);
          continue;
        }

        const commitsData = await response.json();
        if (!Array.isArray(commitsData)) {
          this.logger.warn(`GitHub API returned non-array commit list for ${project.github_repo}`);
          continue;
        }

        const commitsToInsert = commitsData.map(item => ({
          project_id: project.id,
          hash: item.sha.substring(0, 7),
          message: item.commit?.message || 'No commit message',
          author: item.commit?.author?.name || item.commit?.committer?.name || item.author?.login || 'unknown',
          time: item.commit?.author?.date || new Date().toISOString(),
        }));

        if (commitsToInsert.length > 0) {
          const { error: insertError } = await adminClient
            .from('commits')
            .upsert(commitsToInsert, { onConflict: 'project_id,hash' });

          if (insertError) {
            this.logger.error(`Failed to upsert commits for ${project.name}: ${insertError.message}`);
          } else {
            totalSyncedCommits += commitsToInsert.length;
          }
        }
      } catch (err: any) {
        this.logger.error(`Error syncing project ${project.name}: ${err.message}`);
      }
    }

    // 3. Update last_sync timestamp on integration
    await adminClient
      .from('integrations')
      .update({ last_sync: new Date().toISOString() })
      .eq('workspace_id', workspaceId)
      .eq('provider', 'github');

    return {
      success: true,
      syncedProjectsCount: projectsToSync.length,
      syncedCommitsCount: totalSyncedCommits,
      message: `Successfully synchronized ${projectsToSync.length} projects.`,
    };
  }

  async disconnectIntegration(user: any, provider: string) {
    const userId = user.sub || user.id;
    const adminClient = this.supabaseService.getAdminClient();
    const workspaceId = await this.getWorkspaceIdForUser(adminClient, userId);

    const { error } = await adminClient
      .from('integrations')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('provider', provider);

    if (error) {
      this.logger.error(`Failed to delete integration ${provider}: ${error.message}`);
      throw new BadRequestException(`Failed to disconnect ${provider}`);
    }

    return { success: true, message: `${provider} disconnected successfully.` };
  }
}

