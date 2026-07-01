import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController { constructor(private transactions: TransactionsService) {} @Get() findAll() { return this.transactions.findAll(); } @Post() create(@Body() dto: CreateTransactionDto) { return this.transactions.create(dto); } }
