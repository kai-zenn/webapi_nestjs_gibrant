import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
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
  @Post()
  async create(@Body() post: CreatePostDTO) {
    const data = await this.postService.create(post);
    return {
      success: true,
      data: this.mapPost(data),
      message: 'Postingan berhasil ditambahkan',
    };
  }
  @Patch(':id')
  async update(@Param('id') id: number, @Body() post: UpdatePostDTO) {
    const data = await this.postService.update(+id, post);
    return {
      success: true,
      data: this.mapPost(data),
      message: 'Postingan berhasil diperbarui',
    };
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
