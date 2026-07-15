import { Controller, Post, Body, Request } from "@nestjs/common";
import { ChatCopilotService } from "./chat/chat-copilot.service";

@Controller("api/copilot")
export class CopilotController {
  constructor(private readonly chatCopilotService: ChatCopilotService) {}

  @Post("chat")
  async chat(@Request() req, @Body("message") message: string, @Body("history") history: any[] = []) {
    const userId = req.user?.userId || "MOCK_USER_ID"; // fallback for testing if no auth guard
    if (!req.user?.userId) {
      throw new Error("Unauthorized");
    }
    return this.chatCopilotService.processChat(userId, message, history);
  }
}
