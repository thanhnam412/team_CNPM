import { Controller, Get, Post, Patch, Delete, Body, Param } from "@nestjs/common";
import { ProjectsService } from "./projects.service";

@Controller("api/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() createProjectDto: any) {
    return this.projectsService.create(createProjectDto);
  }

  @Get(":id/finance")
  getFinance(@Param("id") id: string) {
    return this.projectsService.getFinance(id);
  }

  @Get(":id/marketplace")
  getMarketplace(@Param("id") id: string) {
    return this.projectsService.getMarketplace(id);
  }

  @Post(":id/finance/add-funds")
  addFunds(@Param("id") id: string, @Body() data: { amount: number }) {
    return this.projectsService.addFunds(id, data.amount);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.projectsService.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(id);
  }
}
