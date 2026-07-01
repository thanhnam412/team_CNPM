import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chat')
export class ChatController { constructor(private chat: ChatService) {} @Get(':contractId') find(@Param('contractId') contractId: string) { return this.chat.findByContract(contractId); } @Post() send(@Body() dto: SendMessageDto) { return this.chat.send(dto); } @Post(':contractId') sendToContract(@Param('contractId') contractId: string, @Body() dto: Omit<SendMessageDto, 'contractId'>) { return this.chat.send({ ...dto, contractId } as SendMessageDto); } }
