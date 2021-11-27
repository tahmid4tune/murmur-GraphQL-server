import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => Int, { description: 'Author ID' })
  authorId: number;

  @Field()
  text: string;
}
