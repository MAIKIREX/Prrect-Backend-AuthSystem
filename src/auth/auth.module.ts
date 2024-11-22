import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import config from './../config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [UsersModule, JwtModule.registerAsync({
    inject: [config.KEY],
    useFactory: (configService: ConfigType<typeof config>) => {
      return {
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: '10d',
        },
      };
    },
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
