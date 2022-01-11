import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { PaginationInput } from '../common/dto/pagination.input';
import { getPaginationInfo } from '../common/utils/pagination.util';
import { FollowsService } from '../follows/follows.service';
import { User } from '../users/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { PostListOutput } from './dto/post-list-output';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly followService: FollowsService,
  ) {}

  async create(createPostInput: CreatePostInput, author: User): Promise<Post> {
    const post: Post = this.postRepository.create({
      ...createPostInput,
      ...{ author: author, authorId: author.id },
    });
    return await this.postRepository.save(post);
  }

  async findAll(
    paginationInput: PaginationInput,
    user: User,
  ): Promise<PostListOutput> {
    const followedUsers: User[] =
      await this.followService.getUsersFollowedByThisUser(user);
    followedUsers.push(user);
    const [posts, count] = await this.postRepository.findAndCount({
      ...getPaginationInfo(paginationInput),
      relations: ['author', 'likes', 'likes.likedBy'],
      where: { authorId: In(followedUsers.map((user) => user.id)) },
      order: { createdAt: 'DESC' },
    });
    return { posts: posts, total: count };
  }

  async getPostsByUser(
    paginationInput: PaginationInput,
    userId: number,
    currentUser: User,
  ): Promise<PostListOutput> {
    const followedUsers: User[] =
      await this.followService.getUsersFollowedByThisUser(currentUser);
    followedUsers.push(currentUser);
    if (!followedUsers.filter((user) => user.id === userId).length) {
      throw new UnauthorizedException();
    }
    const [posts, count] = await this.postRepository.findAndCount({
      ...getPaginationInfo(paginationInput),
      relations: ['author'],
      where: { authorId: userId },
      order: { createdAt: 'DESC' },
    });
    return { posts: posts, total: count };
  }

  async findOne(id: number) {
    return await this.postRepository.findOne(id);
  }

  async update(updatePostInput: UpdatePostInput, author: User): Promise<Post> {
    const post: Post = await this.validateRequest(updatePostInput.id, author);
    post.text = updatePostInput.text;
    return await this.postRepository.save(post);
  }

  async remove(id: number, author: User): Promise<EntityDeletedOutput> {
    const post: Post = await this.validateRequest(id, author);
    await this.postRepository.remove(post);
    return { data: 'Post deleted' };
  }

  async validateRequest(postId: number, author: User): Promise<Post> {
    const post: Post = await this.findOne(postId);
    if (!post || post.authorId !== author.id) {
      throw new BadRequestException();
    }
    return post;
  }
}
