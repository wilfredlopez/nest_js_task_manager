import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { JWTSecret } from "src/constants/constants";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import * as config from "config";

const jwtConfig = config.get("jwt");

const secret = process.env.JWT_SECRET || jwtConfig.secret;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: User, done: (a: Error | null, b?: User) => void) {
    try {
      const user = await this.userRepository.findOne({
        email: payload.email,
      });

      done(null, user);
    } catch (err) {
      throw new UnauthorizedException("unauthorized", err.message);
    }
  }
}
