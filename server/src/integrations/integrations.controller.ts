import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ConnectGithubDto } from './dto/connect-github.dto';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { CurrentUser } from '../supabase/current-user.decorator';

@Controller('integrations')
@UseGuards(SupabaseAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  async getIntegrations(@CurrentUser() user: any) {
    return this.integrationsService.getIntegrations(user);
  }

  @Post('github/connect')
  async connectGithub(@CurrentUser() user: any, @Body() dto: ConnectGithubDto) {
    return this.integrationsService.connectGithub(user, dto);
  }

  @Post('github/sync')
  async syncGithub(@CurrentUser() user: any) {
    return this.integrationsService.syncGithub(user);
  }

  @Delete(':provider')
  async disconnectIntegration(@CurrentUser() user: any, @Param('provider') provider: string) {
    return this.integrationsService.disconnectIntegration(user, provider);
  }
}

