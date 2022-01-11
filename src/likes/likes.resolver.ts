import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { LoggedInUser } from '../auth/interface/current-user.interface';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { Like } from './entities/likes.entity';
import { LikesService } from './likes.service';

@Resolver()
@UseGuards(AuthGuard)
export class LikesResolver {
  constructor(private readonly likeService: LikesService) {}

  @Mutation(() => Like)
  async likePost(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.likeService.likePost(user, id);
  }

  @Mutation(() => EntityDeletedOutput)
  async dislikePost(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.likeService.dislikePost(user, id);
  }
}
