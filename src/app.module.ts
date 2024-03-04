import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KonyvModule } from './konyv/konyv.module';

@Module({
  imports: [KonyvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
