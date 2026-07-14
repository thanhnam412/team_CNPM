import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { Public } from "../../decorators/public.decorator";
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddFundsDto,
} from './dto/project.dto';

@Controller("api/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user?.userId || createProjectDto.clientId;
    if (!userId)
      throw new UnauthorizedException(
        "Unauthorized: Cannot create project without user",
      );
    return this.projectsService.create(userId, createProjectDto);
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
  addFunds(@Request() req, @Param("id") id: string, @Body() data: AddFundsDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.projectsService.addFunds(id, data.amount, userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: UpdateProjectDto) {
    return this.projectsService.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(id);
  }
}
