import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './job.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { toJob } from '../common/mongo-mappers';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private model: Model<JobDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}
  async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toJob); }
  async findOne(id: string) { const job = await this.model.findById(id); if (!job) throw new NotFoundException('Job not found'); return toJob(job); }
  async create(dto: CreateJobDto) {
    const job = await this.model.create({
      ...dto,
      enterpriseId: dto.enterpriseId || '',
      level: dto.budget > 6000 ? 'Enterprise' : dto.budget > 2500 ? 'Pro' : 'Starter',
      proposalIds: [],
      status: dto.status ?? 'open',
      aiBrief: `AI brief: ${dto.title} nên chia discovery, prototype/eval, delivery/handover.`,
    });
    await this.notificationModel.create({ userId: job.clientId, title: 'Đã tạo việc làm', body: job.title, tone: 'success', entityType: 'job', entityId: String(job._id) });
    return toJob(job);
  }
  async update(id: string, dto: UpdateJobDto) {
    const job = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!job) throw new NotFoundException('Job not found');
    await this.notificationModel.create({ userId: job.clientId, title: 'Việc làm đã cập nhật', body: `${job.title} → ${job.status}`, tone: 'info', entityType: 'job', entityId: String(job._id) });
    return toJob(job);
  }
}
