import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { MailClient } from './services/send-grid.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cobel_melo'),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
    ConfigModule.forRoot({
      expandVariables: true
    })
  ],
  controllers: [UsersController, AuthController],
  providers: [AppService, UsersService, AuthService, MailClient],
})
export class AppModule { }
