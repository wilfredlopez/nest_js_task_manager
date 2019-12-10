import {
  MinLength,
  MaxLength,
  IsString,
  Matches,
  IsEmail,
} from "class-validator";

export class AuthCredentialsDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(5)
  @MaxLength(29)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password is too week",
  })
  password: string;
  // Passwords will contain at least 1 upper case letter
  // Passwords will contain at least 1 lower case letter
  // Passwords will contain at least 1 number or special character
  // There is no length validation (min, max) in this regex!
}
