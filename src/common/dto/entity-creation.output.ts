import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EntityCreatedOutput {
  @Field({ description: 'Created' })
  data: string;
}
