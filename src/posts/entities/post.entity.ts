import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
