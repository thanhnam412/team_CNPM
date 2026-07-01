import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestonesService } from './milestones.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('milestones')
export class MilestonesController { constructor(private milestones: MilestonesService) {} @Get() findAll(@Query('contractId') contractId?: string) { return this.milestones.findAll(contractId); } @Post() create(@Body() dto: CreateMilestoneDto) { return this.milestones.create(dto); } @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateMilestoneDto) { return this.milestones.update(id, dto); } }
