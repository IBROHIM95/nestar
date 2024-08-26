import { Args, Mutation,Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { log } from 'console';
import { Member } from '../../libs/dto/member/member';


@Resolver()     //controll va rooterlar o'rnida ishlaydi va GarphQL APIlarni qurib beradi
export class MemberResolver {
   constructor(private readonly memberService: MemberService) {}
               // GQL uchun alohida string yozamiz js uchun alohida
   @Mutation(() => Member)  
  
   public async signup(@Args('input') input:MemberInput ): Promise<Member> {
      
       console.log('Mutation: signup')
       return this.memberService.signup(input)
       
   }

   @Mutation(() => Member)
  
   public async login(@Args('input') input:LoginInput): Promise<Member> {
      console.log('Mutation login');
      return this.memberService.login(input) 

   }

   @Mutation(() => String)
   public async updateMember(): Promise<string> {
    console.log('Mutation updateMember');
    return this.memberService.updateMember()  
   }
   
   @Query(() => String)
   public async getMember(): Promise<string> {
    console.log('Query getMember');
    return this.memberService.getMember()  
   }
}
