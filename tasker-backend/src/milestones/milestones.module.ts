import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { Milestone, MilestoneSchema } from './milestone.schema';
import { Contract, ContractSchema } from '../contracts/contract.schema';
import { Transaction, TransactionSchema } from '../transactions/transaction.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({ imports: [MongooseModule.forFeature([{ name: Milestone.name, schema: MilestoneSchema }, { name: Contract.name, schema: ContractSchema }, { name: Transaction.name, schema: TransactionSchema }, { name: Notification.name, schema: NotificationSchema }, { name: User.name, schema: UserSchema }])], controllers: [MilestonesController], providers: [MilestonesService], exports: [MilestonesService, MongooseModule] })
export class MilestonesModule {}
