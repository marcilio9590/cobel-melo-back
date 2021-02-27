import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { SeedSchema } from './schemas/seed.schema';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { MailClient } from './services/send-grid.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cobel_melo'),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      },
      {
        name: 'Seed',
        schema: SeedSchema
      }
    ]),
    ConfigModule.forRoot({
      expandVariables: true
    })
  ],
  controllers: [UsersController, AuthController],
  providers: [AppService, UsersService, AuthService, MailClient, TokenService],
})
export class AppModule { }
