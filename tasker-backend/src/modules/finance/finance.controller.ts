import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { FinanceService } from "./finance.service";

@Controller("api/users/:userId/finance")
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get("wallet")
  getWallet(@Param("userId") userId: string) {
    return this.financeService.getWallet(userId);
  }

  @Get("transactions")
  getTransactions(@Param("userId") userId: string) {
    return this.financeService.getTransactions(userId);
  }

  @Post("mock-topup")
  mockTopup(@Param("userId") userId: string, @Body() data: { amount: number }) {
    return this.financeService.mockTopup(userId, data.amount);
  }
}
