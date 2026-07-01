import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalsService } from './proposals.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('proposals')
export class ProposalsController {
  constructor(private proposals: ProposalsService) {}
  @Get() findAll() { return this.proposals.findAll(); }
  @Post() @Roles('expert', 'admin') create(@Body() dto: CreateProposalDto) { return this.proposals.create(dto); }
  @Patch(':id') @Roles('client', 'admin') update(@Param('id') id: string, @Body() dto: UpdateProposalDto) { return this.proposals.update(id, dto); }
  @Post(':id/accept') @Roles('client', 'admin') accept(@Param('id') id: string) { return this.proposals.accept(id); }
}
