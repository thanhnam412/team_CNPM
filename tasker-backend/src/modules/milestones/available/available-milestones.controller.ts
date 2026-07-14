import { Controller, Get } from "@nestjs/common";
import { MilestonesService } from "../milestones.service";

@Controller("api/milestones")
export class AvailableMilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get("available")
  findAvailable() {
    return this.milestonesService.findAvailable();
  }
}
