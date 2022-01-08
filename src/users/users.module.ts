import { CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Follow } from '../follows/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow]), CacheModule.register()],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
