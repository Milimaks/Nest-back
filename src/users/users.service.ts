import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly PrismaService: PrismaService) {}
  async getUsers() {
    const users = this.PrismaService.user.findMany({
      select: {
        id: true,
        firstname: true,
        email: true,
      },
    });
    return users;
  }

  async getUser({ userId }: { userId: string }) {
    const user = this.PrismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }
}
