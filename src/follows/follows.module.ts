import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Follow } from './entities/follow.entity';
import { FollowsResolver } from './follows.resolver';
import { FollowsService } from './follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), UsersModule],
  providers: [FollowsResolver, FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
