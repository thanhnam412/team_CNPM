import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}
  @Get() @Roles('admin') findAll() { return this.users.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.users.findById(id); }
  @Post() @Roles('admin') create(@Body() dto: CreateUserDto) { return this.users.create(dto); }
  @Patch(':id') @Roles('admin') update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.users.update(id, dto); }
}
