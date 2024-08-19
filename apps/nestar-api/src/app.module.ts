import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot()],   //APINI ISHLATISHGA IMKON BERADI
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
