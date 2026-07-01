import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './review.schema';
import { User, UserSchema } from '../users/user.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';
@Module({ imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }, { name: User.name, schema: UserSchema }, { name: Notification.name, schema: NotificationSchema }])], controllers: [ReviewsController], providers: [ReviewsService], exports: [ReviewsService, MongooseModule] })
export class ReviewsModule {}
