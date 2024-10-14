import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';
import { lookupAuthMemberFollowed, lookupAuthMemberLiked, lookupFollowersData, lookupFollowingData } from '../../libs/config';
import { T } from '../../libs/types/common';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
        private readonly memberService: MemberService,
){}

  public async subscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower>{
    if(followerId.toString() === followingId.toString()) {
        throw new InternalServerErrorException(Message.NO_DATA_FOUND)
    }
        
    const targetMember = await this.memberService.getMember(null, followingId);
    if(!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
 
        const result = await this.registerSubscription(followerId, followingId )

        await this.memberService.memberStatsEditor({_id:followerId, targetKey:'memberFollowings', modifier: 1 })
        await this.memberService.memberStatsEditor({_id:followingId,  targetKey:'memberFollowers', modifier: 1 })
 
        return result
    }

    public async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<Follower>{
        try{

            return await this.followModel.create({
                followingId: followingId ,
                followerId: followerId,
                
            })
        }catch(err){
          console.log('Error, Service.module', err.message);
          throw new BadRequestException(Message.CREATE_FAILED)
        }
    }

    public async unsubscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower>{
        const targetId = await this.memberService.getMember(null, followingId)
        if (!targetId) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const result = await this.followModel.findOneAndDelete({
            followingId: followingId,
            followerId: followerId
        })
        await this.memberService.memberStatsEditor({_id:followerId, targetKey:'memberFollowings', modifier: -1 })
        await this.memberService.memberStatsEditor({_id:followingId,  targetKey:'memberFollowers', modifier: -1 })
 

        if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result


    }

    public async getMemberFollowings(memberId: ObjectId, input: FollowInquiry): Promise<Followings>{
        const {page, limit, search} = input
        if(!search?.followerId) throw new InternalServerErrorException(Message.BAD_REQUEST);
        const match: T = {followerId: search?.followerId};
        console.log('match:', match);

        const result = await this.followModel
         .aggregate([
            {$match: match},
            {$sort: {createdAt: Direction.DESC}},
            {
                $facet: {
                    list: [
                        {$skip:(page - 1) * limit},
                        {$limit: limit},
                        lookupAuthMemberLiked(memberId, '$followingId'),
                        lookupAuthMemberFollowed({followerId: memberId, followingId: '$followingId' }),
                        lookupFollowingData,
                        {$unwind: '$followingData'},
                    ],
                    metaCounter: [{$count: 'total'}]
                },
            },
         ])
         .exec();
         if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

       return result[0]     
        
    }

    public async getMemberFollowers(memberId: ObjectId, input: FollowInquiry): Promise<Followers>{
        const {page, limit, search} = input
        if(!search?.followingId) throw new InternalServerErrorException(Message.BAD_REQUEST);
        const match: T = {followingId: search?.followingId};
        console.log('match:', match);

        const result = await this.followModel
         .aggregate([
            {$match: match},
            {$sort: {createdAt: Direction.DESC}},
            {
                $facet: {
                    list: [
                        {$skip:(page - 1) * limit},
                        {$limit: limit},
                        lookupAuthMemberLiked(memberId, '$followerId'),
                        lookupAuthMemberFollowed({followerId: memberId, followingId: '$followerId' }),
                        lookupFollowersData,
                        {$unwind: '$followerData'},
                    ],
                    metaCounter: [{$count: 'total'}]
                },
            },
         ])
         .exec();
         if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

       return result[0]     
        
    }
}