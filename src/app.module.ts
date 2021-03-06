import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppService } from './app.service';
import { modelProviders } from './config/model.providers';
import { MongooseModule } from './config/mongoose.module';
import { jwtConstants } from './constants/constants';
import { AuthController } from './controllers/auth.controller';
import { CustomersController } from './controllers/customers.controller';
import { DashboardsController } from './controllers/dashboards.controller';
import { HearingController } from './controllers/hearings.controller';
import { ProcessAreaController } from './controllers/process-area.controller';
import { ProcessController } from './controllers/process.controller';
import { TokensController } from './controllers/token.controller';
import { UsersController } from './controllers/users.controller';
import { ProfileGuard } from './guards/profile.guard';
import { AuthService } from './services/auth.service';
import { CustomersService } from './services/customers.service';
import { DashboardsService } from './services/dashboards.service';
import { HearingService } from './services/hearings.service';
import { InstallmentsService } from './services/installments.service';
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 3600 },
    }),
  ],
  controllers: [
    UsersController,
    AuthController,
    TokensController,
    CustomersController,
    ProcessController,
    ProcessAreaController,
    HearingController,
    DashboardsController
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
    InstallmentsService,
    DashboardsService,
    ...modelProviders,
    {
      provide: APP_GUARD,
      useClass: ProfileGuard,
    }
  ]
})
export class AppModule { }
