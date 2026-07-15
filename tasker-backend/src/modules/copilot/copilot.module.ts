import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/database/database.module";
import { CopilotController } from "./copilot.controller";
import { ChatCopilotService } from "./chat/chat-copilot.service";
import { CreateProjectCopilotService } from "./create-project/create-project-copilot.service";
import { SearchExpertsCopilotService } from "./search-experts/search-experts-copilot.service";
import { CreateQuickTaskCopilotService } from "./create-quick-task/create-quick-task-copilot.service";

import { WalletModule } from "@/modules/wallet/wallet.module";

@Module({
  imports: [DatabaseModule, WalletModule],
  controllers: [CopilotController],
  providers: [
    ChatCopilotService,
    CreateProjectCopilotService,
    SearchExpertsCopilotService,
    CreateQuickTaskCopilotService,
  ],
  exports: [
    ChatCopilotService,
    CreateProjectCopilotService,
    SearchExpertsCopilotService,
    CreateQuickTaskCopilotService,
  ],
})
export class CopilotModule {}
