import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { Proposal, ProposalDocument } from './proposal.schema';
import { Job, JobDocument } from '../jobs/job.schema';
import { Contract, ContractDocument } from '../contracts/contract.schema';
import { Milestone, MilestoneDocument } from '../milestones/milestone.schema';
import { Transaction, TransactionDocument } from '../transactions/transaction.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { Message, MessageDocument } from '../chat/message.schema';
import { toContract, toProposal } from '../common/mongo-mappers';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectModel(Proposal.name) private model: Model<ProposalDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Milestone.name) private milestoneModel: Model<MilestoneDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}
  async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toProposal); }
  async create(dto: CreateProposalDto) {
    const proposal = await this.model.create({ ...dto, status: 'sent', score: 92, eta: dto['eta'] || '21 days' });
    const job = await this.jobModel.findById(dto.jobId);
    if (job) {
      job.proposalIds = [String(proposal._id), ...(job.proposalIds || [])];
      if (job.status === 'open') job.status = 'matching';
      await job.save();
      await this.notificationModel.create({ userId: job.clientId, title: 'Có đơn ứng tuyển mới', body: job.title, tone: 'info', entityType: 'proposal', entityId: String(proposal._id) });
    }
    await this.notificationModel.create({ userId: dto.expertId, title: 'Đã gửi đơn ứng tuyển', body: dto.jobId, tone: 'success', entityType: 'proposal', entityId: String(proposal._id) });
    return toProposal(proposal);
  }
  async update(id: string, dto: UpdateProposalDto) {
    const proposal = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return toProposal(proposal);
  }
  async accept(id: string) {
    const proposal = await this.model.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');
    const job = await this.jobModel.findById(proposal.jobId);
    if (!job) throw new NotFoundException('Job not found');
    proposal.status = 'accepted'; await proposal.save();
    await this.model.updateMany({ jobId: proposal.jobId, _id: { $ne: proposal._id }, status: { $in: ['sent', 'pending', 'shortlisted'] } }, { $set: { status: 'rejected' } });
    job.status = 'active'; await job.save();
    const contract = await this.contractModel.create({ jobId: String(job._id), proposalId: String(proposal._id), clientId: job.clientId, expertId: proposal.expertId, title: `${job.title} Contract`, totalBudget: proposal.rate, escrowAmount: proposal.rate, releasedAmount: 0, privacy: 'private_delivery', progress: 0, status: 'active' });
    const m1 = Math.round(proposal.rate * 0.25), m2 = Math.round(proposal.rate * 0.4), m3 = proposal.rate - m1 - m2;
    const milestones = await this.milestoneModel.insertMany([
      { contractId: String(contract._id), title: 'Discovery + architecture blueprint', amount: m1, dueDate: new Date().toISOString().slice(0, 10), status: 'planned', order: 1 },
      { contractId: String(contract._id), title: 'Prototype + evaluation harness', amount: m2, dueDate: new Date().toISOString().slice(0, 10), status: 'in_progress', order: 2 },
      { contractId: String(contract._id), title: 'Production handover + documentation', amount: m3, dueDate: new Date().toISOString().slice(0, 10), status: 'planned', order: 3 },
    ]);
    contract.milestoneIds = milestones.map((m) => String(m._id)); await contract.save();
    await this.transactionModel.create({ userId: job.clientId, contractId: String(contract._id), type: 'deposit', amount: proposal.rate, status: 'completed', note: 'Escrow created when proposal accepted' });
    await this.messageModel.create({ contractId: String(contract._id), senderId: 'system', body: 'Hợp đồng đã được tạo. Escrow đã được giữ và cột mốc đã sẵn sàng.', kind: 'system' });
    await this.notificationModel.create([{ userId: job.clientId, title: 'Đã tạo hợp đồng', body: contract.title, tone: 'success', entityType: 'contract', entityId: String(contract._id) }, { userId: proposal.expertId, title: 'Proposal được chấp nhận', body: contract.title, tone: 'success', entityType: 'contract', entityId: String(contract._id) }]);
    return toContract(contract);
  }
}
