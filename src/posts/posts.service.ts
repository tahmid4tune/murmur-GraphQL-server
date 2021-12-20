import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { User } from '../users/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
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

  findAll() {
    return `This action returns all posts`;
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
