import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { FinanceService } from "./finance.service";

@Controller("api/users/:userId/finance")
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get("transactions")
  getTransactions(@Param("userId") userId: string) {
    return this.financeService.getTransactions(userId);
  }

  @Post("transactions")
  createTransaction(@Param("userId") userId: string, @Body() data: any) {
    return this.financeService.createTransaction(userId, data);
  }
}
