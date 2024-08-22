import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { DatabaseModule } from './database/database.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';

@Module({
  imports: [MemberModule,
     PropertyModule, 
     DatabaseModule, 
     CommentModule, 
     LikeModule, 
     ViewModule, 
     FollowModule, 
     BoardArticleModule]
})
export class ComponentsModule {}
