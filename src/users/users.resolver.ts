import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { UserListOutput } from './dto/users-list.output';
import { EntityDeletedOutput } from '../common/dto/entity-deletion.output';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { LoggedInUser } from '../auth/interface/current-user.interface';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => UserListOutput, { name: 'users' })
  @UseGuards(AuthGuard)
  findAll(
    @Context() { user }: LoggedInUser,
    @Args('paginationInput') paginationInput: PaginationInput,
    @Args('name') name: string,
  ) {
    return this.usersService.findAll(paginationInput, name, user);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => EntityDeletedOutput)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
