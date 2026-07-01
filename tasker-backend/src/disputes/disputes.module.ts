import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { Dispute, DisputeSchema } from './dispute.schema';
import { Contract, ContractSchema } from '../contracts/contract.schema';
import { Transaction, TransactionSchema } from '../transactions/transaction.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';
import { User, UserSchema } from '../users/user.schema';
@Module({ imports: [MongooseModule.forFeature([{ name: Dispute.name, schema: DisputeSchema }, { name: Contract.name, schema: ContractSchema }, { name: Transaction.name, schema: TransactionSchema }, { name: Notification.name, schema: NotificationSchema }, { name: User.name, schema: UserSchema }])], controllers: [DisputesController], providers: [DisputesService], exports: [DisputesService, MongooseModule] })
export class DisputesModule {}
