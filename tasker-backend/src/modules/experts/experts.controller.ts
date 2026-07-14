import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { ExpertsService } from './experts.service';
import { Public } from "../../decorators/public.decorator";
import {
  UpsertExpertProfileDto,
  CreateReviewDto,
} from './dto/experts.dto';

@Controller("api/experts")
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get("me")
  async getMyProfile(@Req() req: any) {
    return this.expertsService.getMyProfile(req.user.userId);
  }

  @Post("me")
  async upsertMyProfile(@Req() req: any, @Body() data: UpsertExpertProfileDto) {
    return this.expertsService.upsertProfile(req.user.userId, data);
  }

  @Public()
  @Get()
  findAll(
    @Req() req: any,
    @Query("search") search?: string,
    @Query("skill") skill?: string,
    @Query("minRating") minRating?: string,
    @Query("badge") badge?: string,
    @Query("online") online?: string,
  ) {
    let currentUserId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );
        currentUserId = payload.sub;
      } catch (e) {}
    }

    return this.expertsService.findAll({
      search,
      skill,
      minRating: minRating ? parseFloat(minRating) : undefined,
      badge,
      online: online === "true" ? true : undefined,
      excludeUserId: currentUserId,
    });
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.expertsService.findOne(id);
  }

  @Get(":id/overview")
  getOverview(@Req() req, @Param("id") id: string) {
    if (req.user.userId !== id)
      throw new ForbiddenException("Cannot view overview of another expert");
    return this.expertsService.getOverview(id);
  }

  @Post(":id/reviews")
  createReview(@Param("id") expertId: string, @Body() data: CreateReviewDto) {
    return this.expertsService.createReview(expertId, data);
  }

  @Public()
  @Get(":id/reviews")
  getReviews(@Param("id") expertId: string) {
    return this.expertsService.getReviews(expertId);
  }
}
