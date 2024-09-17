
//TARTIB
/*
 npm i @nestja/config ikkita portni ishlatishgaimkon beradi
loyihamizda GraphQL integratsiyasini amalga oshiramiz va ilk GraohQL API requestimizni amalga oshiramiz
 loyihani standartlarini shakllantiramiz
 database hosil qilamiz
 loyihani databasega ulaymiz
loyihani barcha schema modellarini tashkillaymiz va enumlarni hosil qilamiz 


  */


// TUSHUNCHALAR
/*
Bizni saytimiz monorepo mode chunki bittadan ortiq server mavjud
Bitta server bo'lganda standart mode bo'lardi
Nestda modullar decoraterlar orqali yasaladi
Module decoraterning 4ta propertiesi bor: import,controller,provider,export
Burak loyihasida Schemani oxirida modulni joylashtirgan edik NestJSda modulega hamda service 
 modulga @Injection qilib joylashtirdik 

Pipe validation- backendga kirish-chiqish  malumotlarni validate qiladi
Pipe validation- class-validator orqali hosil bo'ladi
DTO- client va backend orasida uzatilinayotgan malumotlarni to'ri yoki 
to'g'rimasligini bilish uchun ishlatamiz 

Nestjsda resolverlarda try va catchni ishlatmaymiz chunki GQLning
formatErroridan foydalanib errorlarni handle qilamiz
Interceptorlar serverga kerish va chiqish vaqtlarini ko'rsatadi
Frontent validation, Pipe validation, serverda backend validation 
va schemada database validation
Fazalar - interceptor => pipe va guard => resolver => 
service module => schema moudel => database => interceptor

Authentication qilishni  3 usuli mavjud
 1.Sessions(Cookies)
 2.Tokens(Cookies)
 3. Tokens(headers)- mobile uchun ham

 Datalarni validate qilish uchun 'class-validate' dan foydalandik
 Data validatelarni express.js da ham ishlatsak bo'ladi lekin faqat schemaga kirib
 kelgandan so'ngishlatsa bo'ladi nest.js ga oxshab pipe, guardlari yoq
 @Field- bu GQL uchun field
 @Args- frontentdan malumotlarni olib kelib beradi

 @Args('input') input:MemberInput - birinchi 'input'da @Args GQLning ichida kelayotgan
 data, ikkinchi input kiritayotgan data 

 if faqat truth va false tekshiradi, truenimas
 @ObjectType- GQL orqali chiqib ketayotgan datalarga beramiz
 @InputType- GQL orqali kirib kelayotgan datalar

 Modullarni servicega chaqirib olish uchun Modulning provider
 qismida Service va Resolverni beramiz va Servisning constructor
 qismiga @InjectModuleni berib private readonly model: Model<type>
 ni beramiz.
 Resolver qismiga Service chaqirib olish uchun ham   constructor 
 qismiga private readonly service: Service deb yozamiz

 Nest.jsda ikkita arcitectual pattern va ikkita design patternlardan
 foydalanamiz. 
MVC va DI Arcitectual va Decorator & middleware design patternlar

jwtService- bu malumotlarni xavfsiz tarzdauzatish uchun
ishlatilinadigan standart, buni ishlatish uchun modulning imports
qismiga JwtModule.register({
secret: 'proccess.env.Secret_token', 
signOption: {expires: 60}

}) va service qismida payloadni yaratib olamiz va 
 return this.jwtService.signAsync(Payload) orqali JWT tokenni
 yaratib olamiz

 Object.keys- asosan objectlarning dinamik xususiyatlarini olish va 
 ularga ishlov berish ishlatilinadi

 [_doc] - mongoose objecti orqali malumotlarni olasiz, maxfiy yoki 
 qo'shimcha malumotlarni chiqarib tashlash uchun ishlatilinadi

 Bir modelni boshqa modelni ichida ishlatish uchun export bo'layotgan model model papkasini
 ichida exportga Serviceni yozadi va import qilayotgan mdelni o'zining
 importida yozadi

 jwtService.signAsync orqali datani tooken qilamiz va 
 jwtService.verifyAsync orqali tokenlarni dataga aylantirayapmiz

 authentication- bu kim request qilayotganini aniqlaydi
 authorization - bu qanaqa permitlari borligini ham ko'rsatib beradi
return true - bo'lsa keyingi proccessga otkizadi

nest g app nestar-batch - yangi monerepo server


malumot qaytadigan dto larga @ObjectTypeni beramiz

*/



