import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.stratgy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
import { MailerService } from 'src/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });
    if (!existingUser) {
      throw new Error('User not found');
    }
    if (!isPasswordValid) {
      throw new Error('Incorrect password');
    }
    return await this.authenticateUser({ userId: existingUser.id });
    // const hashedPassword = await this.hashPassword({ password });
  }

  async register({ registerBody }: { registerBody: CreateUserDto }) {
    try {
      const { email, firstname, password } = registerBody;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new Error('A user with that email already exists');
      }
      const hashedPassword = await this.hashPassword({ password });
      const createdUser = await this.prisma.user.create({
        data: {
          email,
          firstname,
          password: hashedPassword,
        },
      });

      await this.mailerService.sendCreatedAccountEmail({
        firstname,
        recipient: email,
      });

      return this.authenticateUser({ userId: createdUser.id });
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }

  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }

  private async authenticateUser({ userId }: UserPayload) {
    const payload: UserPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
