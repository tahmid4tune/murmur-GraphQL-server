import { Field, ObjectType } from '@nestjs/graphql';
import { TotalCount } from '../../common/dto/Total.output';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserWithFollow extends User {
  @Field(() => Boolean, {
    description: 'Is current user already following this user',
  })
  isFollowing: boolean;
}

@ObjectType()
export class UserListOutput extends TotalCount {
  @Field(() => [UserWithFollow], { description: 'List of users' })
  users: UserWithFollow[];
}
