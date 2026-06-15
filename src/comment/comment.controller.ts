import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  ParseIntPipe,
  // Req,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Controller('/api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  private mapComment(comment: CommentEntity) {
    return {
      id: comment.id,
      body: comment.body,
      user: {
        id: comment.user?.id ?? null,
        username: comment.user?.username ?? 'unknown',
      },
      postId: comment.post?.id ?? null,
      createdAt: comment.createdAt,
    };
  }
  @Post()
  async create(
    // @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDTO,
    // @Req() req: any,
  ) {
    const data = await this.commentService.create(dto);
    const map = this.mapComment(data);
    return {
      success: true,
      data: [map],
      message: 'Komentar berhasil dipost',
    };
    // const userId = req.user.userId;
    // const data = await this.commentService.create(dto, postId, userId);
    // return {
    //   success: true,
    //   data: {
    //     id: data.id,
    //     body: data.body,
    //     username: data.user.username,
    //     createdAt: data.createdAt,
    //   },
    //   message: 'Komentar berhasil ditambahkan',
  }

  @Get()
  async findAll() {
    const data = await this.commentService.findAll();
    const mapped = data.map((c) => this.mapComment(c));
    return {
      success: true,
      data: mapped,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.commentService.findOne(id);
    const map = this.mapComment(data);
    return {
      success: true,
      data: [map],
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    const data = await this.commentService.update(id, dto);
    const map = this.mapComment(data);
    return {
      success: true,
      data: [map],
      message: 'Komentar berhasil diperbarui',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.remove(id);
    return { success: true, message: 'Komentar berhasil dihapus' };
  }
}
