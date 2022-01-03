import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { LoggedInUser } from '../auth/interface/current-user.interface';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { FollowStatOutput } from './dto/follow-stat-output';
import { Follow } from './entities/follow.entity';
import { FollowsService } from './follows.service';

@Resolver()
export class FollowsResolver {
  constructor(private readonly followService: FollowsService) {}

  @Mutation(() => Follow)
  @UseGuards(AuthGuard)
  async followUser(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) userId: number,
  ) {
    return await this.followService.doFollow(user, userId);
  }

  @Mutation(() => EntityDeletedOutput)
  @UseGuards(AuthGuard)
  async unfollowUser(@Args('id', { type: () => Int }) id: number) {
    return await this.followService.unFollow(id);
  }

  @Query(() => FollowStatOutput, { name: 'followStat' })
  @UseGuards(AuthGuard)
  async getUsersFollowStat(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) userId: number,
  ) {
    return await this.followService.getUsersFollowStats(user, userId);
  }
}
