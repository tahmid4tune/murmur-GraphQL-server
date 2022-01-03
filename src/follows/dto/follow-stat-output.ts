import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FollowStatOutput {
  @Field(() => Int, { description: 'Number of users followed by this user' })
  follows: number;

  @Field(() => Int, { description: 'Number of users who follow this user' })
  followedBy: number;
}
