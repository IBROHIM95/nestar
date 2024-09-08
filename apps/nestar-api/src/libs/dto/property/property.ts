import {Field, Int, ObjectType} from '@nestjs/graphql'
import { ObjectId } from 'mongoose'
import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Member, TotalCounter } from '../member/member';

//backenddan clientga boradigan malumotlarni dtoqiladi
@ObjectType()
export class Property {
 @Field(() => String)
 _id: ObjectId;

 @Field(() => PropertyType)
 propertyType: PropertyType;s

 @Field(() => PropertyLocation)
 propertyLocation: PropertyLocation;

 @Field(() => String)
 propertyAddress: string;

 @Field(() => String)
 propertyTitle: string;

 @Field(() => Number)
 propertyPrice: number;

 
 @Field(() => Number)
 propertySquare: number;

 
 @Field(() => Number)
 propertyBeds: number;

 
 @Field(() => Number)
 propertyRooms: number;

 
 @Field(() => Number)
 propertyViews: number;

 
 @Field(() => Number)
 propertyLikes: number;

 
 @Field(() => Number)
 propertyComments: number;

 
 @Field(() => Number)
 propertyRank: number;

 @Field(() => [String])
 propertyImages: string[];

 @Field(() => String, {nullable: true})
 propertyDesc?: string;

 @Field(() => Boolean)
 propertyBarter: boolean;

 @Field(() => Boolean)
 propertyRent: boolean;

 @Field(() => String)
 memberId:ObjectId
 
 @Field(() => Date, {nullable: true})
 soldAt?: Date

 @Field(() => Date, {nullable: true})
 deletedAt?: Date

 @Field(() => Date, {nullable: true})
 constructedAt?: Date

 @Field(() => Date)
 createdAt: Date

 @Field(() => Date)
 updatedAt: Date

 @Field(() => Member, {nullable: true})
 memberData?: Member 

 
} 

@ObjectType()
export class Properties {
  @Field(() => [Property])
  list: Property[]

  @Field(()=> [TotalCounter], {nullable: true})
  metaCounter: TotalCounter[]

}

