import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendMessageDto } from './dto/send-message.dto';
import { Message, MessageDocument } from './message.schema';
import { Contract, ContractDocument } from '../contracts/contract.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { toMessage } from '../common/mongo-mappers';
@Injectable()
export class ChatService { constructor(@InjectModel(Message.name) private model: Model<MessageDocument>, @InjectModel(Contract.name) private contractModel: Model<ContractDocument>, @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {} async findByContract(contractId: string) { return (await this.model.find({ contractId }).sort({ createdAt: 1 })).map(toMessage); } async send(dto: SendMessageDto) { const msg = await this.model.create({ kind: dto.kind ?? 'text', ...dto }); const c = await this.contractModel.findById(dto.contractId); if (c) { const recips = [c.clientId, c.expertId].filter((id) => id !== dto.senderId); await this.notificationModel.create(recips.map((userId) => ({ userId, title: 'Tin nhắn workspace mới', body: dto.body.slice(0, 120), tone: 'info', entityType: 'message', entityId: String(msg._id) }))); } return toMessage(msg); } }
