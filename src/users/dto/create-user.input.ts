import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ description: 'User Name' })
  name: string;

  @Field({ description: 'User Password' })
  password: string;
}
