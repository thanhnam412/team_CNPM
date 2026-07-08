import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [WalletService],
  exports: [WalletService], // ← Export để các UseCase module khác inject được
})
export class WalletModule {}
