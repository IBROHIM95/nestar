import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  /*biz bu yerda global integratsiani amalga oshirdik
  yani  butun tizimimiz uchun  ishlaydi degani 
  */
  const app = await NestFactory.create(AppModule); //NestFactory orqali NestJS ilovasi yaratilinadi
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
/*
npm run start:dev ni run qilganimizda birinchi bo'lib
 main.ts ishga tushadi sababi entryfile ga `main` kiritilgan 
 
*/
 