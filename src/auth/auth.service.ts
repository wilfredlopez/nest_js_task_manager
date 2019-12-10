import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./user-dto/auth-credentials.dto";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";

export interface AuthenticatePayload {
  user: User;
  accessToken: string;
}

@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async singUp(credentials: AuthCredentialsDto): Promise<User> {
    return this.userRepository.SignUp(credentials);
  }

  async login(credentials: AuthCredentialsDto): Promise<AuthenticatePayload> {
    const user = await this.userRepository.validateUserPassword(credentials);

    const { email } = user;
    const payload = { email };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { user, accessToken };
  }
}
