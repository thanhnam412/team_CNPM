import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ContractsService } from "./contracts.service";
import { ReleasePaymentService } from "./release/release-payment.service";

@Controller("api/contracts")
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly releasePaymentService: ReleasePaymentService,
  ) {}

  @Get()
  findByUser(@Request() req) {
    return this.contractsService.findByUser(req.user?.userId);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.contractsService.findById(id);
  }

  /**
   * POST /api/contracts/:id/release-funds — Dùng ReleasePaymentUseCase
   * Đây là action phức tạp: chuyển tiền, PAID milestone, log transactions
   */
  @Post(":id/release-funds")
  releaseFunds(@Request() req, @Param("id") id: string) {
    const clientId = req.user?.userId;
    if (!clientId) throw new UnauthorizedException("Unauthorized");
    return this.releasePaymentService.execute(id, clientId);
  }

  @Post("milestone/:milestoneId/release-funds")
  async releaseByMilestone(
    @Request() req,
    @Param("milestoneId") milestoneId: string,
  ) {
    const clientId = req.user?.userId;
    if (!clientId) throw new UnauthorizedException("Unauthorized");
    const contract = await this.contractsService.findByMilestone(milestoneId);
    if (!contract) {
      throw new NotFoundException(
        "Active contract not found for this milestone",
      );
    }
    return this.releasePaymentService.execute(contract.id, clientId);
  }
}
