import { Query,Args, Mutation, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import {  UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoDBObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';

@Resolver()
export class FollowResolver {
    constructor(private readonly followService: FollowService){}

    @UseGuards(AuthGuard)
    @Mutation((results) => Follower)
    public async subscribe(
        @Args('input') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Follower> {
        console.log('@Mutation: subcribe');
        const followingId = shapeIntoMongoDBObjectId(input);
        return await this.followService.subscribe(memberId, followingId)
        
    }

    @UseGuards(AuthGuard)
    @Mutation((results) => Follower)
    public async unsubscribe(
        @Args('input') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Follower>{
        console.log('@Muatation: unsubscribe');
        const followingId = shapeIntoMongoDBObjectId(input)
        return await this.followService.unsubscribe(memberId, followingId)
        
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Followings)
    public async getMemberFollowings(
        @Args('input') input: FollowInquiry,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Followings> {
       const {followerId} = input.search
      console.log('Query: getMemberFollowings');
      input.search.followerId = shapeIntoMongoDBObjectId(followerId);
      return await this.followService.getMemberFollowings(memberId, input )
      
    }

    
    @UseGuards(WithoutGuard)
    @Query((returns) => Followers)
    public async getMemberFollowers(
        @Args('input') input: FollowInquiry,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Followings> {
       const {followingId} = input.search
      console.log('Query: getMemberFollowers');
      input.search.followingId = shapeIntoMongoDBObjectId(followingId);
      return await this.followService.getMemberFollowers(memberId, input )
      
    }


}
