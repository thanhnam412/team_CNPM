import { Controller, Get } from "@nestjs/common";
import { MilestonesService } from './milestones.service';
import { Public } from "../../decorators/public.decorator";

@Controller("api/milestones")
export class AvailableMilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get("available")
  findAvailable() {
    return this.milestonesService.findAvailable();
  }
}
