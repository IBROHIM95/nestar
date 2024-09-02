import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import {graphqlUploadExpress} from 'graphql-upload'
import  * as express from 'express'

async function bootstrap() {
  /*biz bu yerda global integratsiani amalga oshirdik
  yani  butun tizimimiz uchun  ishlaydi degani 
  */
  const app = await NestFactory.create(AppModule); //NestFactory orqali NestJS ilovasi yaratilinadi
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalPipes(new ValidationPipe()) //pipeni global tarsda ishlatish
  app.enableCors({origin: true, credentials: true})

  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10}))
  app.use('/uploads', express.static('./uploads')) //faylni tashqaolamga ochish
  
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
/*
npm run start:dev ni run qilganimizda birinchi bo'lib
 main.ts ishga tushadi sababi entryfile ga `main` kiritilgan 
 
*/
 