import { Controller, Get, Post, Body, Param, Request } from "@nestjs/common";
import { MessagesService } from './messages.service';

@Controller("api/users/:userId/conversations")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getConversations(@Param("userId") userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get(":conversationId/messages")
  getMessages(@Param("conversationId") conversationId: string) {
    return this.messagesService.getMessages(conversationId);
  }

  @Post(":conversationId/messages")
  sendMessage(
    @Request() req,
    @Param("conversationId") conversationId: string,
    @Body() data: any,
  ) {
    return this.messagesService.sendMessage(req.user.userId, conversationId, data);
  }
}
