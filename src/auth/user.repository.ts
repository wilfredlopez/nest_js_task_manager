import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./user-dto/auth-credentials.dto";
import * as bcrypt from "bcryptjs";
import {
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async SignUp(credentials: AuthCredentialsDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const user = this.create({
      email: credentials.email,
      password: await this.hashPassword(credentials.password, salt),
      salt: salt.toString(),
    });

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === "23505") {
        // user already exist in database
        throw new ConflictException("User Already Exist");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string | number) {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(credentials: AuthCredentialsDto) {
    const { email, password } = credentials;

    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      throw new ForbiddenException("Unauthorized");
      //   return null;
    }
  }
}
