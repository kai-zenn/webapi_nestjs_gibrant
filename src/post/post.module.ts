import { Module } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommentModule } from 'src/comment/comment.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), CommentModule, AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
