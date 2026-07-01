import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './transaction.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { User, UserDocument } from '../users/user.schema';
import { toTransaction } from '../common/mongo-mappers';
@Injectable()
export class TransactionsService { constructor(@InjectModel(Transaction.name) private model: Model<TransactionDocument>, @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>) {} async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toTransaction); } async create(dto: CreateTransactionDto) { const dbType = dto.type === 'release' ? 'milestone_release' : dto.type === 'escrow' ? 'deposit' : dto.type === 'fee' ? 'platform_fee' : dto.type; const txn = await this.model.create({ ...dto, type: dbType, status: dto.status === 'success' ? 'completed' : dto.status ?? 'completed' }); if (dto.type === 'withdraw' || dto.type === 'withdrawal') await this.userModel.findByIdAndUpdate(dto.userId, { $inc: { walletBalance: -Math.abs(dto.amount) } }); await this.notificationModel.create({ userId: dto.userId, title: 'Ví điện tử đã cập nhật', body: `${dto.type}: $${dto.amount}`, tone: 'success', entityType: 'transaction', entityId: String(txn._id) }); return toTransaction(txn); } }
