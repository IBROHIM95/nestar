import { Args, Mutation,Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsInquery, LoginInput, MemberInput, MembersInquery } from '../../libs/dto/member/member.input';
import { log } from 'console';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { getSerialForImage, shapeIntoMongoDBObjectId, validMimeTypes } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Message } from '../../libs/enums/common.enum';


@Resolver()     //controll va rooterlar o'rnida ishlaydi va GarphQL APIlarni qurib beradi
export class MemberResolver {
   constructor(private readonly memberService: MemberService) {} //DI => object
   
               // GQL uchun alohida string yozamiz js uchun alohida
   @Mutation(() => Member)
     public async signup(@Args('input') input:MemberInput ): Promise<Member> {   //GQLdan kelgan datani uchun @Argsni ishlatamiz  
       console.log('Mutation: signup')
       return await this.memberService.signup(input)
       
   }

   @Mutation(() => Member)
  public async login(@Args('input') input:LoginInput): Promise<Member> {
      console.log('Mutation login');
      return await this.memberService.login(input) 

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
    return await this.memberService.updateMember(memberId, input)  
   }

   @UseGuards(AuthGuard)
   @Query(() => String)
   public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string>{
    console.log('memberNick', memberNick);
    return await `hi ${memberNick}`
    
   }
   @Roles(MemberType.USER, MemberType.AGENT)
   @UseGuards(RolesGuard)
   @Query(() => String)
   public async checkAuthRoles(@AuthMember() authmember: Member): Promise<string>{
    console.log('checkAuthRoles');
    
    // console.log('memberNick', memberNick);
    return await `hi ${authmember.memberNick},you are ${authmember.memberType} (memberId): ${authmember._id}`
    
   }

   @UseGuards(WithoutGuard)
   @Query(() => Member)
   public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId) : Promise<Member> {
    console.log('Query getMember');
    const targetId = shapeIntoMongoDBObjectId(input)

    return await this.memberService.getMember(memberId, targetId)  
   }

   @UseGuards(WithoutGuard)
   @Query(() => Members)
   public async getAgent(@Args('input') input: AgentsInquery, @AuthMember('_id') memberId: ObjectId): Promise<Members>{
    console.log('Query getAgent');
    return await this.memberService.getAgent(memberId, input)
   }

   /* ADMIN */

  
   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Query(() => Members)
   public async getAllMemberByAdmin(@Args('input') input: MembersInquery): Promise<Members>{ 
    return await this.memberService.getAllMemberByAdmin(input)
   }

   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation(() => Member)
   public async updateMemberByAdmin(@Args('input') input: MemberUpdate ): Promise<Member> {
    console.log('Mutation: updateMemberByAdmin');
    return await this.memberService.updateMemberByAdmin(input);
    
   }

   /* UPLOADER  */

@UseGuards(AuthGuard)
@Mutation((returns) => String)
public async imageUploader(
	@Args({ name: 'file', type: () => GraphQLUpload })
{ createReadStream, filename, mimetype }: FileUpload,
@Args('target') target: String,
): Promise<string> {
	console.log('Mutation: imageUploader');

	if (!filename) throw new Error(Message.UPLOAD_FAILED);
const validMime = validMimeTypes.includes(mimetype);
if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

const imageName = getSerialForImage(filename);
const url = `uploads/${target}/${imageName}`;
const stream = createReadStream();

const result = await new Promise((resolve, reject) => {
	stream
		.pipe(createWriteStream(url))
		.on('finish', async () => resolve(true))
		.on('error', () => reject(false));
});
if (!result) throw new Error(Message.UPLOAD_FAILED);

return url;
}

@UseGuards(AuthGuard)
@Mutation((returns) => [String])
public async imagesUploader(
	@Args('files', { type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
    @Args('target') target: String,
): Promise<string[]> {
	console.log('Mutation: imagesUploader');

	const uploadedImages = [];
	const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
		try {
			const { filename, mimetype, encoding, createReadStream } = await img;

			const validMime = validMimeTypes.includes(mimetype);
			if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

			const imageName = getSerialForImage(filename);
			const url = `uploads/${target}/${imageName}`;
			const stream = createReadStream();

			const result = await new Promise((resolve, reject) => {
				stream
					.pipe(createWriteStream(url))
					.on('finish', () => resolve(true))
					.on('error', () => reject(false));
			});
			if (!result) throw new Error(Message.UPLOAD_FAILED);

			uploadedImages[index] = url;
		} catch (err) {
			console.log('Error, file missing!');
		}
	});

	await Promise.all(promisedList);
	return uploadedImages;
}
}
