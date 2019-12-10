import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthCredentialsDto } from "./user-dto/auth-credentials.dto";
import { AuthService, AuthenticatePayload } from "./auth.service";
import { User } from "./user.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators/getUser.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body(ValidationPipe) credentials: AuthCredentialsDto): Promise<User> {
    return this.authService.singUp(credentials);
  }

  @Post("/login")
  login(
    @Body(ValidationPipe) credentials: AuthCredentialsDto,
  ): Promise<AuthenticatePayload> {
    return this.authService.login(credentials);
  }

  @Post("/me")
  @UseGuards(AuthGuard())
  me(@GetUser() user: User) {
    // console.log(user);
    return user;
  }
}
