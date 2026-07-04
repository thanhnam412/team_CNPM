import { Controller, Get, Post, Patch, Delete, Body, Param } from "@nestjs/common";
import { MilestonesService } from "./milestones.service";

@Controller("api/projects/:projectId/milestones")
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  findByProject(@Param("projectId") projectId: string) {
    return this.milestonesService.findByProject(projectId);
  }

  @Post()
  create(@Param("projectId") projectId: string, @Body() data: any) {
    return this.milestonesService.create(projectId, data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.milestonesService.update(id, data);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.milestonesService.updateStatus(id, status);
  }

  @Post(":id/submit")
  submitDeliverables(@Param("id") id: string, @Body() data: any) {
    return this.milestonesService.submitDeliverables(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.milestonesService.remove(id);
  }

  @Get(":id/bids")
  getBids(@Param("id") id: string) {
    return this.milestonesService.getBids(id);
  }

  @Post(":id/bids")
  createBid(@Param("id") id: string, @Body() data: any) {
    return this.milestonesService.createBid(id, data);
  }

  @Post("bids/:bidId/accept")
  acceptBid(@Param("bidId") bidId: string) {
    return this.milestonesService.acceptBid(bidId);
  }
}
