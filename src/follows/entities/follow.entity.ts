import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Follow {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Follow ID' })
  id: number;

  @ManyToOne(() => User, (user) => user.follows)
  public followed_by!: User;

  @ManyToOne(() => User, (user) => user.followed_by)
  public follows!: User;
}
