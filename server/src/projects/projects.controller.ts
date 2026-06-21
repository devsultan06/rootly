import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { CurrentUser } from '../supabase/current-user.decorator';

@Controller('projects')
@UseGuards(SupabaseAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(@CurrentUser() user: any) {
    return this.projectsService.getProjects(user);
  }

  @Post()
  async createProject(@CurrentUser() user: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(user, dto);
  }
}
