import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { ContractsService } from './contracts.service';
import { UpdateContractDto } from './dto/update-contract.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contracts')
export class ContractsController { constructor(private contracts: ContractsService) {} @Get() findAll() { return this.contracts.findAll(); } @Get(':id') findOne(@Param('id') id: string) { return this.contracts.findOne(id); } @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateContractDto) { return this.contracts.update(id, dto); } }
