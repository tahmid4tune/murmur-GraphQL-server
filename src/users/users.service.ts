import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginationInput } from '../common/dto/pagination.input';
import { getPaginationInfo } from '../common/utils/pagination.util';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserListOutput } from './dto/users-list.output';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput) {
    const user: User = this.userRepository.create(createUserInput);
    return await this.userRepository.save(user);
  }
  //Need to send totalcount too.
  async findAll(paginationInput: PaginationInput): Promise<UserListOutput> {
    const [users, count] = await this.userRepository.findAndCount({
      ...getPaginationInfo(paginationInput),
    });
    return { users: users, total: count };
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  async findByUserName(name: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name: name } });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user: User = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found with ID: ${id}`);
    }
    return await this.userRepository.save(updateUserInput);
  }

  async remove(id: number): Promise<DeleteResult> {
    const user: User = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found with ID: ${id}`);
    }
    return await this.userRepository.delete(id);
  }
}
