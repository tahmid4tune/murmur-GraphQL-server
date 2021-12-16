import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EntityDeletedOutput {
  @Field({ description: 'Deleted' })
  data: string;
}
