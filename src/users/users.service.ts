import {
  CacheInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginationInput } from '../common/dto/pagination.input';
import { getPaginationInfo } from '../common/utils/pagination.util';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserListOutput } from './dto/users-list.output';
import { User } from './entities/user.entity';
import { Cache } from 'cache-manager';
@Injectable()
@UseInterceptors(CacheInterceptor)
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    return await this.userRepository.findOne(id);
  }

  async findUsersByIds(ids: number[]): Promise<User[]> {
    return await this.userRepository.findByIds(ids);
  }

  async getUserWithFollowStats(id: number): Promise<User> {
    const cachedUserWithFollowStat: User = await this.cacheManager.get(
      `user_with_follow_${id}`,
    );
    if (cachedUserWithFollowStat) {
      return cachedUserWithFollowStat;
    }

    const userWithFollowStat: User = await this.userRepository.findOne({
      where: { id: id },
      relations: ['followed_by', 'follows'],
    });
    await this.cacheManager.set(`user_with_follow_${id}`, userWithFollowStat, {
      ttl: 3,
    });
    return userWithFollowStat;
  }

  async findByUserName(name: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name: name } });
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
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
