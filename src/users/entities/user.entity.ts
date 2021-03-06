import { ObjectType, Field, Int } from '@nestjs/graphql';
import { instanceToPlain } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Follow } from '../../follows/entities/follow.entity';
import { Like } from '../../likes/entities/likes.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'User ID' })
  id: number;

  @Column()
  @Field({ description: 'User Name' })
  name: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (posts) => posts.author, { nullable: true })
  @Field((type) => [Post], { nullable: true })
  posts!: Post[];

  @OneToMany(() => Follow, (follow) => follow.followed_by)
  follows!: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follows)
  followed_by!: Follow[];

  @OneToMany(() => Like, (like) => like.likedBy)
  likes!: Like[];

  toJSON() {
    return instanceToPlain(this);
  }
}
