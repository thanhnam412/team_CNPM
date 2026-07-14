import { Controller, Post, Body, Request } from "@nestjs/common";
import { ChatCopilotService } from "./chat/chat-copilot.service";

@Controller("api/copilot")
export class CopilotController {
  constructor(private readonly chatCopilotService: ChatCopilotService) {}

  @Post("chat")
  async chat(@Request() req, @Body("message") message: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return this.chatCopilotService.processChat(userId, message);
  }
}
