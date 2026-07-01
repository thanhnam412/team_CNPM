import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { DisputesService } from './disputes.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disputes')
export class DisputesController { constructor(private disputes: DisputesService) {} @Get() findAll() { return this.disputes.findAll(); } @Post() create(@Body() dto: CreateDisputeDto) { return this.disputes.create(dto); } @Patch(':id') @Roles('admin') update(@Param('id') id: string, @Body() dto: UpdateDisputeDto) { return this.disputes.update(id, dto); } }
