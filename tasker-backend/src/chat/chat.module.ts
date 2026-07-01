import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './message.schema';
import { Contract, ContractSchema } from '../contracts/contract.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';
@Module({ imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }, { name: Contract.name, schema: ContractSchema }, { name: Notification.name, schema: NotificationSchema }])], controllers: [ChatController], providers: [ChatService], exports: [ChatService, MongooseModule] })
export class ChatModule {}
