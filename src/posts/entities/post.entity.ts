import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from '../../likes/entities/likes.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Post ID' })
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  @Field((type) => User, { description: 'Author of the post' })
  author: User;

  @Column()
  @Field(() => Int, { description: 'Author ID' })
  authorId: number;

  @OneToMany(() => Like, (like) => like.post)
  @Field(() => [Like], { description: 'Likes on this post' })
  likes!: Like[];

  @Column({ length: 500 })
  @Field()
  text: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
