import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobs: JobsService) {}
  @Get() findAll() { return this.jobs.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.jobs.findOne(id); }
  @Post() @Roles('client', 'enterprise', 'admin') create(@Body() dto: CreateJobDto) { return this.jobs.create(dto); }
  @Patch(':id') @Roles('client', 'enterprise', 'admin') update(@Param('id') id: string, @Body() dto: UpdateJobDto) { return this.jobs.update(id, dto); }
}
