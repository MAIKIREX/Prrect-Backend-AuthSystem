import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const currentEmail = await this.userService.findByEmail(email);
    if (!currentEmail) {
      return { exists: false };
    }
    return { exists: true };
  }

  @Get('/:id')
  async getCategory(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.userService.create(payload);
  }

  // user.controller.ts
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.userService.forgotPassword(email);
  }

  @Post('validate-reset-token')
  async validateResetToken(@Body('token') token: string) {
    return await this.userService.validateResetToken(token);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: { token: string; password: string },
  ) {
    return await this.userService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.userService.update(id, payload);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
