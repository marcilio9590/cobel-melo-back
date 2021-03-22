import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppService } from './app.service';
import { MongooseModule } from './config/mongoose.module';
import { modelProviders } from './config/model.providers';
import { jwtConstants } from './constants/constants';
import { AuthController } from './controllers/auth.controller';
import { CustomersController } from './controllers/customers.controller';
import { HearingController } from './controllers/hearings.controller';
import { ProcessAreaController } from './controllers/process-area.controller';
import { ProcessController } from './controllers/process.controller';
import { TokensController } from './controllers/token.controller';
import { UsersController } from './controllers/users.controller';
import { ProfileGuard } from './guards/profile.guard';
import { AuthService } from './services/auth.service';
import { CustomersService } from './services/customers.service';
import { HearingService } from './services/hearings.service';
import { ProcessAreaService } from './services/process-area.service';
import { ProcessService } from './services/process.service';
import { MailClient } from './services/send-grid.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    MongooseModule,
    ConfigModule.forRoot({
      expandVariables: true
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [
    UsersController,
    AuthController,
    TokensController,
    CustomersController,
    ProcessController,
    ProcessAreaController,
    HearingController
  ],
  providers: [
    AppService,
    UsersService,
    AuthService,
    MailClient,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    CustomersService,
    ProcessService,
    ProcessAreaService,
    HearingService,
    ...modelProviders,
    {
      provide: APP_GUARD,
      useClass: ProfileGuard,
    }
  ],
  exports: [JwtModule]
})
export class AppModule { }
