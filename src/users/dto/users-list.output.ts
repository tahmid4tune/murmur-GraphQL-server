import { Field, ObjectType } from '@nestjs/graphql';
import { TotalCount } from '../../common/dto/Total.output';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserListOutput extends TotalCount {
  @Field(() => [User], { description: 'List of users' })
  users: User[];
}
