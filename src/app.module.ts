import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cobel_melo'),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ])
  ],
  controllers: [UsersController, AuthController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule { }
