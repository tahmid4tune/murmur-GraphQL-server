import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { PaginationInput } from '../common/dto/pagination.input';
import { getPaginationInfo } from '../common/utils/pagination.util';
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
  ) {}

  async create(createPostInput: CreatePostInput, author: User): Promise<Post> {
    const post: Post = this.postRepository.create({
      ...createPostInput,
      ...{ author: author, authorId: author.id },
    });
    return await this.postRepository.save(post);
  }

  async findAll(paginationInput: PaginationInput): Promise<PostListOutput> {
    const [posts, count] = await this.postRepository.findAndCount({
      ...getPaginationInfo(paginationInput),
      relations: ['author'],
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
