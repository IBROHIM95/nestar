import { Query,Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import {  UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { ObjectId } from 'mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { shapeIntoMongoDBObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class CommentResolver {
    constructor(private readonly commentService: CommentService){}

    @UseGuards(AuthGuard)
    @Mutation((returns) => Comment)
    public async createComment(
        @Args('input') input: CommentInput,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Comment>{
        console.log('Mutation: createComment');
        return await this.commentService.createComment(memberId, input)
        
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => Comment)
    public async updateComment(
        @Args('input') input: CommentUpdate,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Comment>{
        console.log('Mutation: createComment');
        input._id = shapeIntoMongoDBObjectId(input._id)
        return await this.commentService.updateComment(memberId, input)
        
    }

    
    @UseGuards(WithoutGuard)
    @Query((returns) => Comments)
    public async getComments(
        @Args('input') input: CommentsInquiry,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Comments>{
        console.log('Mutation: createComment');
        input.search.commentRefId = shapeIntoMongoDBObjectId(input.search.commentRefId)
        return await this.commentService.getComments(memberId, input)
        
    }




}