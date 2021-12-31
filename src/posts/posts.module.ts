import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), FollowsModule],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
