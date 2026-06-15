import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
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
  async create(dto: CreateCommentDTO): Promise<CommentEntity> {
    const newComment = this.commentRepository.create({
      body: dto.body,
      user: { id: dto.userId } as UserEntity,
      post: { id: dto.postId } as PostEntity,
    });
    const savedComment = await this.commentRepository.save(newComment);
    return this.commentRepository.findOneOrFail({
      where: { id: savedComment.id },
      relations: ['user', 'post'],
    });
  }

  async findByPost(postId: number) {
    const comment = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'],
      order: { createdAt: 'DESC' },
    });

    return comment.map((c) => this.mapComment(c));
  }

  async findAll(): Promise<CommentEntity[]> {
    return await this.commentRepository.find({
      relations: ['user', 'post'],
    });
  }

  async findOne(id: number): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }
    return comment;
  }

  async update(
    id: number,
    dto: Partial<CreateCommentDTO>,
  ): Promise<CommentEntity> {
    const comment = await this.findOne(id);
    if (dto.body) comment.body = dto.body;
    return await this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment not found`);
    }
    return { message: 'Comment berhasil dihapus' };
  }
}
