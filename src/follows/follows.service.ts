import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { PaginationInput } from '../common/dto/pagination.input';
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
  ) { }

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

  async getPaginatedFollowsUserListForUser(
    currentUser: User,
    paginationInput: PaginationInput,
  ): Promise<User[]> {
    const userWithFollowStats: User =
      await this.userService.getUserWithFollowStats(currentUser.id);
    const followRecords: Follow[] = userWithFollowStats?.follows?.slice(
      (paginationInput.page - 1) * paginationInput.perPage,
    );
    if (!followRecords?.length) {
      return [];
    }
    const followRecordIds = followRecords.map((follow) => follow.id);
    const followRecordEntities: Follow[] = await this.followRepository.find({
      where: { id: In(followRecordIds) },
      relations: ['follows'],
    });
    const alreadyFollowing: number[] = followRecordEntities.map(
      (follow) => follow.follows.id,
    );
    return await this.userService.findUsersByIds(alreadyFollowing);
  }

  async getPaginatedFollowedByUserListForUser(
    currentUser: User,
    paginationInput: PaginationInput,
  ) {
    const userWithFollowStats: User =
      await this.userService.getUserWithFollowStats(currentUser.id);
    const followRecords: Follow[] = userWithFollowStats?.followed_by?.slice(
      (paginationInput.page - 1) * paginationInput.perPage,
    );
    if (!followRecords?.length) {
      return [];
    }
    const followIds: number[] = followRecords.map(
      (followedByUser) => followedByUser.id,
    );
    const followEntities: Follow[] = await this.followRepository.find({
      where: {
        id: In(followIds),
      },
      relations: ['followed_by'],
    });
    const followedByUsers: User[] = await this.userService.findUsersByIds(
      followEntities.map((follow) => follow.followed_by.id),
    );
    const bothWayFollowUsers: Follow[] =
      await this.filterAlreadyFollowedListFromUserList(currentUser, followIds);

    const bothWayFollowIds: number[] = bothWayFollowUsers.map(
      (follow) => follow.followed_by.id,
    );
    return followedByUsers.map((user) =>
      Object.assign({
        ...user,
        ...{ isFollowing: bothWayFollowIds.includes(user.id) },
      }),
    );
  }

  async filterAlreadyFollowedListFromUserList(
    currentUser: User,
    userIdList: number[],
  ): Promise<Follow[]> {
    if (!userIdList?.length) {
      return [];
    }
    return await this.followRepository.find({
      where: {
        followed_by: In(userIdList),
        follows: currentUser,
      },
      relations: ['followed_by'],
    });
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

  async unFollow(
    currentUser: User,
    unfollowId: number,
  ): Promise<EntityDeletedOutput> {
    const followRecord: Follow = await this.followRepository.findOne({
      where: {
        followed_by: currentUser.id,
        follows: unfollowId,
      },
    });
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
