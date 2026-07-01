import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController { constructor(private reviews: ReviewsService) {} @Get() findAll() { return this.reviews.findAll(); } @Post() create(@Body() dto: CreateReviewDto) { return this.reviews.create(dto); } }
