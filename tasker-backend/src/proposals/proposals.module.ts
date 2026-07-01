import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { Proposal, ProposalSchema } from './proposal.schema';
import { Job, JobSchema } from '../jobs/job.schema';
import { Contract, ContractSchema } from '../contracts/contract.schema';
import { Milestone, MilestoneSchema } from '../milestones/milestone.schema';
import { Transaction, TransactionSchema } from '../transactions/transaction.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';
import { Message, MessageSchema } from '../chat/message.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Proposal.name, schema: ProposalSchema },
    { name: Job.name, schema: JobSchema },
    { name: Contract.name, schema: ContractSchema },
    { name: Milestone.name, schema: MilestoneSchema },
    { name: Transaction.name, schema: TransactionSchema },
    { name: Notification.name, schema: NotificationSchema },
    { name: Message.name, schema: MessageSchema },
  ])],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService, MongooseModule],
})
export class ProposalsModule {}
