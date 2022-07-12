import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
// * 字段映射
// * 参数校验
// * 统一响应结构
// * 登录验证
// 权限控制
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @User('id') userId: number) {
    return this.usersService.create(createUserDto, userId);
  }

  @Get()
  findAll(@Query() searchUserDto: SearchUserDto, @User('id') userId: number) {
    return this.usersService.findAll(searchUserDto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @User('id') userId: number) {
    return this.usersService.findById(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: number,
  ) {
    return this.usersService.update(+id, updateUserDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId: number) {
    return this.usersService.remove(+id, userId);
  }
}
