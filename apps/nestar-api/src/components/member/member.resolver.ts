import { Args, Mutation,Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { log } from 'console';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';


@Resolver()     //controll va rooterlar o'rnida ishlaydi va GarphQL APIlarni qurib beradi
export class MemberResolver {
   constructor(private readonly memberService: MemberService) {} //DI => object
               // GQL uchun alohida string yozamiz js uchun alohida
   @Mutation(() => Member)  
   public async signup(@Args('input') input:MemberInput ): Promise<Member> {   //GQLdan kelgan datani uchun @Argsni ishlatamiz  
       console.log('Mutation: signup')
       return this.memberService.signup(input)
       
   }

   @Mutation(() => Member)
  public async login(@Args('input') input:LoginInput): Promise<Member> {
      console.log('Mutation login');
      return this.memberService.login(input) 

   }
  //Authenticated
   @UseGuards(AuthGuard)
   @Mutation(() => Member)
   public async updateMember(
    @Args('input') input: MemberUpdate,
    @AuthMember('_id') memberId: ObjectId
): Promise<Member> {
    console.log('Mutation updateMember');
    delete input._id
    return this.memberService.updateMember(memberId,input)  
   }

   @UseGuards(AuthGuard)
   @Query(() => String)
   public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string>{
    console.log('memberNick', memberNick);
    return `hi ${memberNick}`
    
   }
   @Roles(MemberType.USER, MemberType.AGENT)
   @UseGuards(RolesGuard)
   @Query(() => String)
   public async checkAuthRoles(@AuthMember() authmember: Member): Promise<string>{
    console.log('checkAuthRoles');
    
    // console.log('memberNick', memberNick);
    return `hi ${authmember.memberNick},you are ${authmember.memberType} (memberId): ${authmember._id}`
    
   }

   
   @Query(() => String)
   public async getMember(): Promise<string> {
    console.log('Query getMember');
    return this.memberService.getMember()  
   }

   /* ADMIN */

   //Authorization: ADMIN
   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation(() => String)
   public async getAllMemberByAdmin(@AuthMember() authmember: Member): Promise<string>{
     console.log('authmember.memberType:', authmember.memberType);  
    return this.memberService.getAllMemberByAdmin()
   }

   //Authorization: ADMIN
   @Mutation(() => String)
   public async updateMemberByAdmin(): Promise<string> {
    console.log('Mutation: updateMemberByAdmin');
    return this.memberService.updateMemberByAdmin();
    
   }
}
