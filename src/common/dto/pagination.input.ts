import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { description: 'Current page number', defaultValue: 1 })
  page: number;

  @Field(() => Int, { description: 'Data count per page', defaultValue: 10 })
  perPage: number;
}
