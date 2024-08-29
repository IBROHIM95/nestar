import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class MemberService {
    constructor(@InjectModel('Member') private readonly memberModel: Model<Member>,
     private authService: AuthService) {} 
    public async signup(input: MemberInput): Promise<Member> {
    input.memberPassword = await this.authService.hashPassword(input.memberPassword)
    try{
       const result = await this.memberModel.create(input);
       return result
    } catch(err) {
       console.log('Error, Service.module', err.message);
       throw new BadRequestException(Message.USED_MEMBERNICK_OR_PHONE)
    }
 }  // faqat createda try va catch ishlatamiz, chunki, database 
 //validation errorlarni yuboradi ular nostandart
    public async login(input: LoginInput): Promise<Member> {
      const {memberNick, memberPassword} = input;
      const response = await this.memberModel
      .findOne({memberNick: memberNick})
      .select('+memberPassword')
      .exec();

      if (!response || response.memberNick === MemberStatus.DELETE ){
         throw new InternalServerErrorException(Message.NO_MEMBER_NICK)
      }else if ( response.memberStatus === MemberStatus.BLOCK) {
         throw new InternalServerErrorException(Message.WRONG_PASSWORD)
      }

      const isMatch = await this.authService.comparePassword(input.memberPassword, response.memberPassword)
      if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD)

      return  response 
 }
    public async updateMember(): Promise<string> {
    return 'updateMember excuted' 
 }
    public async getMember(): Promise<string> {
    return 'getMember excuted'  
 }

}
