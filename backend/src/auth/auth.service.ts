import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto, LoginUserDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Validate a user by username and password. This is used by the LocalStrategy for login.
  async validateUser(loginDto: LoginUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      // After finding the user and password that matches remove the password from the user object before returning it.
      const { password, ...result } = user;
      return result;
    }
    // If no user or password mismatch, return null.
    return null;
  }


   // Registers a new user.
   // Hashes the password before saving to the database.
  async register(registerDto: RegisterUserDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create the user in the database
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        password: hashedPassword,
        role: 'USER', // Default role
      },
    });

    // Return the user without the password
    const { password, ...result } = user;
    return result;
  }


    // Creates and signs a JWT for a given user.
   // This is called after a successful login.
  async login(user: any) {
    // The payload is the data to be stored inside the JWT.
    // This is public (not encrypted) but it is signed.
    const payload = {
      username: user.username,
      sub: user.id, // 'sub' (subject) is a standard JWT claim for user ID
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

   // Validates a user by their ID.
   // This is used by the JwtStrategy to verify the token payload.
  async validateUserById(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}