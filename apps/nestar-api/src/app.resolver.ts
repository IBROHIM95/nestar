import {Query, Resolver} from '@nestjs/graphql'

@Resolver()
export class AppResolver {
    @Query(() => String)
    public sayHello(): string {
      return 'Graph API Server'

}   
}

//GraphQL serverlarni hosil qilish uchun  Resolverlardan foydalanamiz