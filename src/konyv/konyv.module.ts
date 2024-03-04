import { Module } from '@nestjs/common';
import { KonyvService } from './konyv.service';
import { KonyvController } from './konyv.controller';

@Module({
  controllers: [KonyvController],
  providers: [KonyvService],
})
export class KonyvModule {}
