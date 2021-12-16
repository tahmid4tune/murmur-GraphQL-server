import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotalCount {
  @Field(() => Int, { description: 'Total number of records' })
  total: number;
}
