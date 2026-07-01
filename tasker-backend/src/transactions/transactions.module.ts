import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSchema } from './transaction.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';
import { User, UserSchema } from '../users/user.schema';
@Module({ imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }, { name: Notification.name, schema: NotificationSchema }, { name: User.name, schema: UserSchema }])], controllers: [TransactionsController], providers: [TransactionsService], exports: [TransactionsService, MongooseModule] })
export class TransactionsModule {}
