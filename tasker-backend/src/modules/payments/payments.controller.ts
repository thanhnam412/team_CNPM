import { Controller, Get, Post, Body, Req, UnauthorizedException } from "@nestjs/common";
import { PaymentsService } from './payments.service';
import { MockTopupDto } from './dto/payments.dto';

@Controller("api/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("me/balance")
  getBalance(@Req() req) {
    if (!req.user?.userId) throw new UnauthorizedException();
    return this.paymentsService.getBalance(req.user.userId);
  }

  @Get("me/transactions")
  getTransactions(@Req() req) {
    if (!req.user?.userId) throw new UnauthorizedException();
    return this.paymentsService.getTransactions(req.user.userId);
  }

  @Post("me/mock-topup")
  mockTopup(@Req() req, @Body() data: MockTopupDto) {
    if (!req.user?.userId) throw new UnauthorizedException();
    return this.paymentsService.mockTopup(req.user.userId, data.amount);
  }
}
