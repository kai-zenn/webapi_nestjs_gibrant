import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDTO } from './dto/update-post.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return await this.postRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`post with id ${id} not found`);
    }
    return post;
  }

  async create(dto: CreatePostDTO): Promise<PostEntity> {
    const newPost = this.postRepository.create({
      title: dto.title,
      content: dto.content,
      author: { id: dto.authorId } as UserEntity,
      publishedDate: dto.publishedDate
        ? new Date(dto.publishedDate)
        : undefined,
    });

    const savedPost = await this.postRepository.save(newPost);

    return this.postRepository.findOneOrFail({
      where: { id: savedPost.id },
      relations: ['author'],
    });
  }

  async update(id: number, dto: UpdatePostDTO): Promise<PostEntity> {
    const existingPost = await this.postRepository.findOneBy({ id });
    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    const postData = this.postRepository.merge(existingPost, dto);
    return this.postRepository.save(postData);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post tidak dapat ditemukan`);
    }
    return { message: 'Post berhasil dihapus' };
  }
}
