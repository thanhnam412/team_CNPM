import { Controller, Get, Param, Query } from "@nestjs/common";
import { TimelineService } from "./timeline.service";

@Controller("api/experts/:expertId/timeline")
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  getTimeline(
    @Param("expertId") expertId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.timelineService.getTimeline(expertId, startDate, endDate);
  }
}
