import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule } from "@nestjs/config";
import { ProjectsModule } from "./modules/projects/projects.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { MilestonesModule } from "./modules/milestones/milestones.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { TeamModule } from "./modules/team/team.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { QuickTasksModule } from "./modules/quick-tasks/quick-tasks.module";
import { ProposalsModule } from "./modules/proposals/proposals.module";
import { ExpertsModule } from "./modules/experts/experts.module";
import { TimelineModule } from "./modules/timeline/timeline.module";
import { InvitationsModule } from "./modules/invitations/invitations.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { WalletModule } from "./modules/wallet/wallet.module";
import { CopilotModule } from "./modules/copilot/copilot.module";
import { ClientsModule } from "./modules/clients/clients.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    MilestonesModule,
    FinanceModule,
    TeamModule,
    MessagesModule,
    QuickTasksModule,
    ProposalsModule,
    ExpertsModule,
    TimelineModule,
    InvitationsModule,
    PaymentsModule,
    ContractsModule,
    WalletModule,
    CopilotModule,
    ClientsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
