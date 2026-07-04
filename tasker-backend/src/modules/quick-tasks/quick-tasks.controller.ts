import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { QuickTasksService } from './quick-tasks.service';

@Controller('api/quick-tasks')
export class QuickTasksController {
  constructor(private readonly quickTasksService: QuickTasksService) {}

  @Get()
  findAll() {
    return this.quickTasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quickTasksService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.quickTasksService.create(data.clientId, data);
  }

  @Get('client/:userId')
  findByClient(@Param('userId') userId: string) {
    return this.quickTasksService.findByClient(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.quickTasksService.update(id, data);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.quickTasksService.updateStatus(id, status);
  }

  @Post(':id/submit')
  submitDeliverable(@Param('id') id: string, @Body() data: any) {
    return this.quickTasksService.submitDeliverable(id, data);
  }

  @Post(':id/approve')
  approveDeliverable(@Param('id') id: string) {
    return this.quickTasksService.approveDeliverable(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quickTasksService.remove(id);
  }
}
