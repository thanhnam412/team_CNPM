import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { ExpertsService } from "./experts.service";

@Controller("api/experts")
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("skill") skill?: string,
    @Query("minRating") minRating?: string,
    @Query("badge") badge?: string,
    @Query("online") online?: string,
  ) {
    return this.expertsService.findAll({
      search,
      skill,
      minRating: minRating ? parseFloat(minRating) : undefined,
      badge,
      online: online === "true" ? true : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.expertsService.findOne(id);
  }

  @Get(":id/overview")
  getOverview(@Param("id") id: string) {
    return this.expertsService.getOverview(id);
  }

  @Post(":id/reviews")
  createReview(
    @Param("id") expertId: string,
    @Body() data: any,
  ) {
    return this.expertsService.createReview(expertId, data);
  }

  @Get(":id/reviews")
  getReviews(@Param("id") expertId: string) {
    return this.expertsService.getReviews(expertId);
  }
}
