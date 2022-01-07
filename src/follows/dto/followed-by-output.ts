import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class FollowedByUser extends User {
  @Field(() => Boolean, { description: 'Is current user following this user' })
  isFollowing: boolean;
}
