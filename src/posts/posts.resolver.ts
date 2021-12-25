import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { LoggedInUser } from '../auth/interface/current-user.interface';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { PaginationInput } from '../common/dto/pagination.input';
import { PostListOutput } from './dto/post-list-output';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async createPost(
    @Context() { user }: LoggedInUser,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    return await this.postsService.create(createPostInput, user);
  }

  @Query(() => PostListOutput, { name: 'posts' })
  @UseGuards(AuthGuard)
  findAll(@Args('paginationInput') paginationInput: PaginationInput) {
    return this.postsService.findAll(paginationInput);
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  updatePost(
    @Context() { user }: LoggedInUser,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ) {
    return this.postsService.update(updatePostInput, user);
  }

  @Mutation(() => EntityDeletedOutput)
  @UseGuards(AuthGuard)
  removePost(
    @Context() { user }: LoggedInUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.postsService.remove(id, user);
  }
}
