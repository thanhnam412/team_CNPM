import { Controller, Get, Param, Query, Req, ForbiddenException } from "@nestjs/common";
import { TimelineService } from "./timeline.service";

@Controller("api/experts/:expertId/timeline")
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  getTimeline(
    @Req() req,
    @Param("expertId") expertId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    if (req.user.userId !== expertId) {
      throw new ForbiddenException("Cannot view timeline of another expert");
    }
    return this.timelineService.getTimeline(expertId, startDate, endDate);
  }
}
