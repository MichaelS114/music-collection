import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginUserDto } from 'src/dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // By default, passport-local expects 'username' and 'password' fields.
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  // validate is automatically called by passport when the /auth/login route is hit.
  async validate(username: string, password: string): Promise<any> {
    const loginDto: LoginUserDto = { username, password };
    
    // Use the AuthService to check if the user exists and the password is correct.
    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      // If authService.validateUser returns null, Passport will throw a 401 Unauthorized.
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // If validation is successful, Passport attaches the 'user' object to the request
    return user;
  }
}