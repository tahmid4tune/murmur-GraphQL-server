import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  @Field({ description: 'User Password' })
  password: string;

  @OneToMany(() => Post, (posts) => posts.author, { nullable: true })
  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
