import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { CommentService } from 'src/comment/comment.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDTO } from 'src/comment/dto/create-comment.dto';

@Controller('/api/posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}
  private mapPost(post: PostEntity) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author?.username ?? 'Unknown',
      publishedDate: post.publishedDate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
  @Get()
  async findAll() {
    const posts = await this.postService.findAll();
    const mappedPosts = posts.map((post) => this.mapPost(post));
    return {
      success: true,
      data: mappedPosts,
      message: 'Data post berhasil ditemukan',
    };
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postService.findOne(+id);
    return {
      success: true,
      data: this.mapPost(data),
      message: 'Data post berhasil ditemukan',
    };
  }
  @Get(':postId/comments')
  async findCommentByPost(@Param('postId', ParseIntPipe) postId: number) {
    const data = await this.commentService.findByPost(postId);
    return {
      success: true,
      data,
    };
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePostDTO, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.postService.create(dto, userId);
    return {
      success: true,
      data: this.mapPost(data),
      message: 'Postingan berhasil ditambahkan',
    };
  }
  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDTO,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const data = await this.commentService.create(dto, postId, userId);
    const map = this.commentService.mapComment(data);

    return { success: true, data: [map], message: 'Komentar berhasil dipost' };
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() post: UpdatePostDTO) {
    const data = await this.postService.update(+id, post);
    return {
      success: true,
      data: this.mapPost(data),
      message: 'Postingan berhasil diperbarui',
    };
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
