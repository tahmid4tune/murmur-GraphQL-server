import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { Like } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    private readonly postService: PostsService,
  ) {}

  async likePost(currentUser: User, postId: number): Promise<Like> {
    const post: Post = await this.getValidatedPost(postId);
    const alreadyLikedPost: Like = await this.findAlreadyLiked(
      currentUser,
      post,
    );
    if (alreadyLikedPost) {
      return alreadyLikedPost;
    }
    return await this.likeRepository.save({ likedBy: currentUser, post: post });
  }

  async findAlreadyLiked(currentUser: User, post: Post): Promise<Like> {
    return await this.likeRepository.findOne({
      likedBy: currentUser,
      post: post,
    });
  }

  async dislikePost(
    currentUser: User,
    postId: number,
  ): Promise<EntityDeletedOutput> {
    const post: Post = await this.getValidatedPost(postId);
    const likedPost: Like = await this.findAlreadyLiked(currentUser, post);
    if (likedPost) {
      await this.likeRepository.remove(likedPost);
    }
    return { data: 'Like removed.' };
  }

  async getValidatedPost(postId: number): Promise<Post> {
    const post: Post = await this.postService.findOne(postId);
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return post;
  }
}
