import { Module } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), CommentModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
