import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller("api/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("users/:userId/balance")
  getBalance(@Param("userId") userId: string) {
    return this.paymentsService.getBalance(userId);
  }

  @Get("users/:userId/transactions")
  getTransactions(@Param("userId") userId: string) {
    return this.paymentsService.getTransactions(userId);
  }

  @Post("users/:userId/mock-topup")
  mockTopup(@Param("userId") userId: string, @Body("amount") amount: number) {
    return this.paymentsService.mockTopup(userId, amount);
  }
}
