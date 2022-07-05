import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/common/exceptions/client.exception';
import { mapDto2Where } from 'src/common/helpers/map-dto-where';
import { Pagination } from 'src/common/types/pagination';
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
      throw new ClientException(
        ClientException.responseCode.user_already_exist,
      );
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
    const [users, count] = await this.userRepository.findAndCount(findOpts);
    return new Pagination(users, count, searchUserDto);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
      status: EUserStatus.enabled,
    });
    if (!user) {
      throw new ClientException(ClientException.responseCode.user_not_exist);
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

  async findByAccount(account: string) {
    const user = await this.userRepository.findOne({
      where: {
        account,
      },
    });
    return user;
  }
}
