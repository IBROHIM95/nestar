import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { JwtService } from '@nestjs/jwt';
import { shapeIntoMongoDBObjectId } from '../../libs/config';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    public async hashPassword(memberPasword: string): Promise<string>{
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(memberPasword, salt)
    }

    public async comparePassword(password: string, hashedPassword :string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword)
    }
      //Memberni tagidan accessTokenni qoshib qo'yadi, malumotdan Token yasaydi
    public async createToken(member: Member): Promise<string> {
        console.log('member', member);
        
        const payload: T = {memberNick: 'TEST'};
        Object.keys(member['_doc']  ? member['_doc'] : member).map((ele) => {
            payload[`${ele}`] = member[`${ele}`]
        });
        delete payload.memberPassword;
        console.log('payload', payload);
        
        return await this.jwtService.signAsync(payload)
    }
     // Tokenni ichidan malumotlarni oladi
    public async verifyToken(token: string): Promise<Member> {
        const member = await this.jwtService.verifyAsync(token);
        member._id = shapeIntoMongoDBObjectId( member._id)
        return member
    }
}
