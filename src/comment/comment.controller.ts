import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('comments')
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.remove(id);
    return { success: true, message: 'Komentar berhasil dihapus' };
  }
}
