import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppService } from './app.service';
import { jwtConstants } from './constants/constants';
import { AuthController } from './controllers/auth.controller';
import { CustomersController } from './controllers/customers.controller';
import { TokensController } from './controllers/token.controller';
import { UsersController } from './controllers/users.controller';
import { ProfileGuard } from './guards/profile.guard';
import CustomerSchema from './schemas/customer.schema';
import HearingSchema from './schemas/hearing.schema';
import MovementSchema from './schemas/movement.schema';
import ProcessAreaSchema from './schemas/process-area.schema';
import ProcessSchema from './schemas/process.schema';
import { SeedSchema } from './schemas/seed.schema';
import UserSchema from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { CustomersService } from './services/customers.service';
import { ProcessService } from './services/process.service';
import { MailClient } from './services/send-grid.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

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
      },
      {
        name: 'Customer',
        schema: CustomerSchema
      },
      {
        name: 'Process',
        schema: ProcessSchema
      },
      {
        name: 'ProcessArea',
        schema: ProcessAreaSchema
      },
      {
        name: 'Movement',
        schema: MovementSchema
      },
      {
        name: 'Hearing',
        schema: HearingSchema
      }
    ]),
    ConfigModule.forRoot({
      expandVariables: true
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UsersController, AuthController, TokensController, CustomersController],
  providers: [AppService, UsersService, AuthService, MailClient, TokenService, LocalStrategy, JwtStrategy, CustomersService, ProcessService,
    {
      provide: APP_GUARD,
      useClass: ProfileGuard,
    }
  ],
  exports: [JwtModule]
})
export class AppModule { }
