import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {GraphQLModule} from '@nestjs/graphql'
import {ApolloDriver} from '@nestjs/apollo'
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';

import { T } from './libs/types/common';


@Module({
  imports: [
  ConfigModule.forRoot(),  //.eny fayli ishlatish uchun kerakli package
  GraphQLModule.forRoot({  //shu orqali biz o'zimizni tizimimizda GraphQLni yoqdik oldin REST API EDI
    driver: ApolloDriver,
    playground: true,
    uploads: false,
    autoSchemaFile: true,
    formatError: (error: T) => {
      console.log('error:', error);
      const graphQLFormattedError = {
        code: error?.extensions.code,
        message:
         error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
      };
      console.log('GRAPHQL GLOBAL ERR:', graphQLFormattedError);
      return graphQLFormattedError
      
    }
  }), 
    ComponentsModule, //hamma componentlarni yigib ko'prik vazifasini bajaryapdi
     DatabaseModule,
   
  ],   
  //biz buni o'chirib qo'ysak ham bo'ladi sababi Rest ham GraphQL ham HTTP protokolda ishlaydi
  controllers: [AppController], 
  providers: [AppService, AppResolver],
})
export class AppModule {}

//APP.MODULE bizda markaziy bog'ichi hisoblanadi sababi hamma modullarimizni integratsiya bo'lgan
// 