import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  getUsers() {
    return this.UsersService.getUsers();
  }
  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.UsersService.getUser({
      userId,
    });
  }
}
