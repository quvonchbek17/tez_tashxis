import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { MongoModule } from 'modules/mongo';
import { AuthModule } from 'modules/auth';

@Module({
  imports: [
    MongoModule,
    AuthModule
  ],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
