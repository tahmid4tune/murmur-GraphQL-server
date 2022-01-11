import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { PostsModule } from '../posts/posts.module';
import { Like } from './entities/likes.entity';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post]), PostsModule],
  providers: [LikesResolver, LikesService],
})
export class LikesModule {}
