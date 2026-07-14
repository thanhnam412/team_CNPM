import { Controller, Post, Body, Request } from "@nestjs/common";
import { CopilotService } from "./copilot.service";

@Controller("api/copilot")
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post("chat")
  async chat(@Request() req, @Body("message") message: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return this.copilotService.processChat(userId, message);
  }
}
