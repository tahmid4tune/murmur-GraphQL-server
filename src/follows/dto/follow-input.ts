import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FollowInput {
  @Field(() => Int)
  userId: number;
}
