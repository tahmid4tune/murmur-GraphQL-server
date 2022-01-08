import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { LoggedInUser } from '../auth/interface/current-user.interface';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { PaginationInput } from '../common/dto/pagination.input';
import { User } from '../users/entities/user.entity';
import { FollowStatOutput } from './dto/follow-stat-output';
import { FollowedByUser } from './dto/followed-by-output';
import { Follow } from './entities/follow.entity';
import { FollowsService } from './follows.service';

@Resolver()
@UseGuards(AuthGuard)
export class FollowsResolver {
  constructor(private readonly followService: FollowsService) {}

  @Mutation(() => Follow)
  async followUser(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) userId: number,
  ) {
    return await this.followService.doFollow(user, userId);
  }

  @Mutation(() => EntityDeletedOutput)
  async unfollowUser(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.followService.unFollow(user, id);
  }

  @Query(() => FollowStatOutput, { name: 'followStat' })
  async getUsersFollowStat(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) userId: number,
  ) {
    return await this.followService.getUsersFollowStats(user, userId);
  }

  @Query(() => [User], { name: 'followingUserList' })
  async getPaginatedFollowingUserList(
    @Context() { user }: LoggedInUser,
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return await this.followService.getPaginatedFollowsUserListForUser(
      user,
      paginationInput,
    );
  }

  @Query(() => [FollowedByUser], { name: 'followedByUserList' })
  async getPaginatedFollowedByUserList(
    @Context() { user }: LoggedInUser,
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return await this.followService.getPaginatedFollowedByUserListForUser(
      user,
      paginationInput,
    );
  }
}
