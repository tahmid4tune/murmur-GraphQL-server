import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { FollowStatOutput } from './dto/follow-stat-output';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly userService: UsersService,
  ) {}

  async getUsersFollowedByThisUser(user: User): Promise<User[]> {
    const followRecords: Follow[] = await this.followRepository.find({
      where: { followed_by: user },
      relations: ['followed_by', 'follows'],
    });
    return followRecords.map((follow) => follow.follows);
  }

  async getUsersFollowStats(
    currentUser: User,
    userId: number,
  ): Promise<FollowStatOutput> {
    const user: User = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException();
    }
    if (currentUser.id != userId) {
      const followRecord: Follow = await this.getFollowRecord(
        user,
        currentUser,
      );
      if (!followRecord) {
        throw new UnauthorizedException();
      }
    }
    const userWithFollowStats: User =
      await this.userService.getUserWithFollowStats(userId);
    return {
      followedBy: userWithFollowStats?.followed_by?.length || 0,
      follows: userWithFollowStats?.follows?.length || 0,
    };
  }

  async doFollow(user: User, id: number): Promise<Follow> {
    const toFollowUser: User = await this.userService.findOne(id);
    if (!toFollowUser) {
      throw new BadRequestException('Mentioned user not found!');
    }
    const existingFollowRecord: Follow = await this.getFollowRecord(
      toFollowUser,
      user,
    );
    if (existingFollowRecord) {
      return existingFollowRecord;
    }
    return await this.followRepository.save({
      follows: toFollowUser,
      followed_by: user,
    });
  }

  async unFollow(id: number): Promise<EntityDeletedOutput> {
    const followRecord: Follow = await this.followRepository.findOne(id);
    if (!followRecord) {
      throw new NotFoundException();
    }
    await this.followRepository.remove(followRecord);
    return { data: `You have successfully unfollowed` };
  }

  async getFollowRecord(follows: User, followedBy: User): Promise<Follow> {
    return await this.followRepository.findOne({
      where: { followed_by: followedBy, follows: follows },
      relations: ['followed_by', 'follows'],
    });
  }
}
