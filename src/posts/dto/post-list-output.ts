import { Field, ObjectType } from '@nestjs/graphql';
import { TotalCount } from '../../common/dto/Total.output';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostListOutput extends TotalCount {
  @Field(() => [Post], { description: 'List of posts' })
  posts: Post[];
}
