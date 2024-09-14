import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import FollowSchema from '../../schemas/Follow.model';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
    imports: [MongooseModule.forFeature([
        {   name: 'Follow',
            schema: FollowSchema
        },
    ]),
       AuthModule,
        MemberModule

    ],
    providers:[FollowResolver, FollowService],
    exports: [FollowService]
})
export class FollowModule {
    
}
