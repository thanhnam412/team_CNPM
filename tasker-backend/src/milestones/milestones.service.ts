import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Milestone, MilestoneDocument } from './milestone.schema';
import { Contract, ContractDocument } from '../contracts/contract.schema';
import { Transaction, TransactionDocument } from '../transactions/transaction.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { User, UserDocument } from '../users/user.schema';
import { toMilestone } from '../common/mongo-mappers';
@Injectable()
export class MilestonesService {
  constructor(@InjectModel(Milestone.name) private model: Model<MilestoneDocument>, @InjectModel(Contract.name) private contractModel: Model<ContractDocument>, @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>, @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findAll(contractId?: string) { const q = contractId ? { contractId } : {}; return (await this.model.find(q).sort({ order: 1, createdAt: -1 })).map(toMilestone); }
  async create(dto: CreateMilestoneDto) { const milestone = await this.model.create({ ...dto, status: dto.status ?? 'planned' }); const c = await this.contractModel.findById(dto.contractId); if (c) { await this.notificationModel.create({ userId: c.clientId, title: 'Cột mốc mới', body: milestone.title, tone: 'info', entityType: 'milestone', entityId: String(milestone._id) }); } return toMilestone(milestone); }
  async update(id: string, dto: UpdateMilestoneDto) {
    const m = await this.model.findById(id); if (!m) throw new NotFoundException('Milestone not found');
    const wasApproved = m.status === 'approved' || m.status === 'paid';
    Object.assign(m, dto);
    if (dto.status === 'submitted') m.submittedAt = new Date();
    if (dto.status === 'approved') m.approvedAt = new Date();
    await m.save();
    const c = await this.contractModel.findById(m.contractId);
    if (c) {
      const list = await this.model.find({ contractId: String(c._id) });
      const approved = list.filter((x) => x.status === 'approved' || x.status === 'paid').length;
      c.progress = list.length ? Math.round((approved / list.length) * 100) : 0;
      if (c.progress === 100) { c.status = 'completed'; c.completedAt = new Date(); }
      await c.save();
      if (dto.status === 'approved' && !wasApproved) {
        await this.transactionModel.create({ userId: c.expertId, contractId: String(c._id), milestoneId: String(m._id), type: 'milestone_release', amount: m.amount, status: 'completed', note: `Giải ngân cột mốc: ${m.title}` });
        await this.userModel.findByIdAndUpdate(c.expertId, { $inc: { walletBalance: m.amount, totalEarnings: m.amount } });
        await this.notificationModel.create([{ userId: c.expertId, title: 'Cột mốc được duyệt', body: `+${m.amount} USD: ${m.title}`, tone: 'success', entityType: 'milestone', entityId: String(m._id) }, { userId: c.clientId, title: 'Đã duyệt cột mốc', body: m.title, tone: 'success', entityType: 'milestone', entityId: String(m._id) }]);
      }
      if (dto.status === 'submitted') await this.notificationModel.create({ userId: c.clientId, title: 'Expert đã nộp cột mốc', body: m.title, tone: 'info', entityType: 'milestone', entityId: String(m._id) });
      if (dto.status === 'change_requested') await this.notificationModel.create({ userId: c.expertId, title: 'Client yêu cầu chỉnh sửa', body: dto.changeRequest || m.title, tone: 'warning', entityType: 'milestone', entityId: String(m._id) });
    }
    return toMilestone(m);
  }
}
