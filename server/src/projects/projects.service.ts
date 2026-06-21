import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

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

  async getProjects(user: any) {
    const userId = user.sub || user.id;
    const adminClient = this.supabaseService.getAdminClient();
    const workspaceId = await this.getWorkspaceIdForUser(adminClient, userId);

    const { data: projects, error } = await adminClient
      .from('projects')
      .select('*, commits(*)')
      .eq('workspace_id', workspaceId)
      .order('time', { foreignTable: 'commits', ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch projects: ${error.message}`);
      throw new BadRequestException('Failed to fetch projects');
    }

    return projects || [];
  }

  async createProject(user: any, dto: CreateProjectDto) {
    const userId = user.sub || user.id;
    const adminClient = this.supabaseService.getAdminClient();
    const workspaceId = await this.getWorkspaceIdForUser(adminClient, userId);

    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Project name is required');
    }

    const { data: project, error } = await adminClient
      .from('projects')
      .insert({
        workspace_id: workspaceId,
        name: dto.name,
        description: dto.description || '',
        status: dto.status || 'on_track',
        github_repo: dto.github_repo || null,
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to create project: ${error.message}`);
      throw new BadRequestException('Failed to create project');
    }

    return project;
  }
}
