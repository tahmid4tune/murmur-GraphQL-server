import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Post ID' })
  id: number;

  @ManyToOne(() => Post, (post) => post.likes)
  @Field((type) => Post, { description: 'The liked post' })
  post: Post;

  @ManyToOne(() => User, (user) => user.likes)
  @Field((type) => User, { description: 'The user who liked the post' })
  likedBy: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
