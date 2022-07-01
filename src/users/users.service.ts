import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mapDto2Where } from 'src/common/helpers/map-dto-where';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EUserStatus } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const has = await this.userRepository.find({
      where: [
        { email: createUserDto.email },
        { account: createUserDto.account },
      ],
    });
    if (has.length) {
      throw new BadRequestException();
    }
    const user = new User();
    Object.assign(user, createUserDto);
    await this.userRepository.save(user);
    return user.getUserRO();
  }

  async findAll(searchUserDto: SearchUserDto) {
    const { page, pageSize } = searchUserDto;
    const where: FindOptionsWhere<User> = {};
    const findOpts: FindManyOptions<User> = {
      where,
      skip: pageSize * (page - 1),
      take: pageSize,
      order: {
        updateTime: 'DESC',
        status: 'ASC',
      },
    };
    mapDto2Where(searchUserDto, where, [
      'username',
      'account',
      'email',
      'status',
    ]);
    const users = await this.userRepository.find(findOpts);
    return users.map((user) => user.getUserRO());
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
      status: EUserStatus.enabled,
    });
    if (!user) {
      throw new BadRequestException();
    }
    if (user) {
      // user.createTime = new Date(user.createTime).getTime();
    }

    return user.getUserRO();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    Object.keys(updateUserDto).forEach((key) => {
      user[key] = updateUserDto[key];
    });

    const updatedUser = await this.userRepository.save(user);

    return updatedUser.getUserRO();
  }

  async remove(id: number) {
    const user = await this.findById(id);
    user.softRemoved = true;
    this.userRepository.save(user);
    return true;
  }
}
