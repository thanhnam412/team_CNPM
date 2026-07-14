import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ProposalsService } from './proposals.service';
import { AcceptProposalUseCase } from "./use-cases/accept-proposal-use-cases.service";
import { Public } from "../../decorators/public.decorator";
import {
  CreateProposalDto,
  UpdateProposalStatusDto,
} from './dto/proposals.dto';

@Controller("api")
export class ProposalsController {
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly acceptProposalUseCase: AcceptProposalUseCase,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  @Post("quick-tasks/:taskId/proposals")
  createProposal(
    @Request() req,
    @Param("taskId") taskId: string,
    @Body() data: CreateProposalDto,
  ) {
    return this.proposalsService.createProposal(
      { quickTaskId: taskId },
      req.user.userId,
      data,
    );
  }

  @Post("milestones/:milestoneId/proposals")
  createMilestoneProposal(
    @Request() req,
    @Param("milestoneId") milestoneId: string,
    @Body() data: CreateProposalDto,
  ) {
    return this.proposalsService.createProposal(
      { milestoneId },
      req.user.userId,
      data,
    );
  }

  // ─── READ ────────────────────────────────────────────────────────────────────

  @Get("quick-tasks/:taskId/proposals")
  getProposalsForTask(@Param("taskId") taskId: string) {
    return this.proposalsService.getProposalsForTask(taskId);
  }

  @Get("milestones/:milestoneId/proposals")
  getProposalsForMilestone(@Param("milestoneId") milestoneId: string) {
    return this.proposalsService.getProposalsForMilestone(milestoneId);
  }

  @Get("users/:userId/proposals")
  getProposalsForExpert(@Param("userId") userId: string) {
    return this.proposalsService.getProposalsForExpert(userId);
  }

  // ─── ACTIONS ─────────────────────────────────────────────────────────────────

  /**
   * PATCH /api/proposals/:id/accept — Dùng AcceptProposalUseCase
   * Đây là action phức tạp nhất: escrow tiền, activate milestone/task, tạo contract
   */
  @Patch("proposals/:proposalId/accept")
  @HttpCode(HttpStatus.OK)
  acceptProposal(@Request() req, @Param("proposalId") proposalId: string) {
    const actorId = req.user?.userId;
    return this.acceptProposalUseCase.execute(proposalId, actorId);
  }

  /**
   * PATCH /api/proposals/:id/status — Chỉ dùng cho REJECTED / WITHDRAWN
   * Accept phải đi qua /accept endpoint để đảm bảo luồng đầy đủ
   */
  @Patch("proposals/:proposalId/status")
  updateProposalStatus(
    @Request() req,
    @Param("proposalId") proposalId: string,
    @Body() data: UpdateProposalStatusDto,
  ) {
    return this.proposalsService.updateStatus(
      req.user.userId,
      proposalId,
      data.status,
    );
  }
}
