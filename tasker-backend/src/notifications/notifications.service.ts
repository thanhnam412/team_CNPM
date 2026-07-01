import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationDocument } from './notification.schema';
import { toNotification } from '../common/mongo-mappers';
@Injectable()
export class NotificationsService { constructor(@InjectModel(Notification.name) private model: Model<NotificationDocument>) {} async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toNotification); } async update(id: string, dto: UpdateNotificationDto) { const n = await this.model.findByIdAndUpdate(id, dto, { new: true }); if (!n) throw new NotFoundException('Notification not found'); return toNotification(n); } }
