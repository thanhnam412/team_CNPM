import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './review.schema';
import { User, UserDocument } from '../users/user.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { toReview } from '../common/mongo-mappers';
@Injectable()
export class ReviewsService { constructor(@InjectModel(Review.name) private model: Model<ReviewDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {} async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toReview); } async create(dto: CreateReviewDto) { const review = await this.model.create(dto); const target = await this.userModel.findById(dto.toUserId); if (target?.role === 'expert') { const reviews = await this.model.find({ toUserId: dto.toUserId }); const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, reviews.length); target.trustScore = Math.min(100, Math.round((target.trustScore * 0.65) + (avg * 20 * 0.35))); target.reputationScore = target.trustScore; await target.save(); } await this.notificationModel.create({ userId: dto.toUserId, title: 'Có đánh giá mới', body: dto.body, tone: 'success', entityType: 'review', entityId: String(review._id) }); return toReview(review); } }
