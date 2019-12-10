import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { JwtModule } from "@nestjs/jwt";
// import { JWTSecret } from "src/constants/constants";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import * as config from "config";

const jwtConfig = config.get("jwt");

const secret = process.env.JWT_SECRET || jwtConfig.secret;
const expiresIn = jwtConfig.expiresIn;
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret,
      signOptions: {
        // notBefore: "2 days",
        expiresIn,
        // noTimestamp: true,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
