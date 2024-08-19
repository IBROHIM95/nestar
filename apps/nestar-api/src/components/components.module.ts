import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [MemberModule, PropertyModule, DatabaseModule]
})
export class ComponentsModule {}
