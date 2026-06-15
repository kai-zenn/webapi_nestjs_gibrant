import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { CreateBookDTO } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDTO } from './dto/update-book.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async findAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async create(dto: CreateBookDTO): Promise<BookEntity> {
    try {
      const newBook = this.bookRepository.create({
        title: dto.title,
        description: dto.description,
        author: { id: dto.authorId } as UserEntity,
        publishedDate: dto.publishedDate
          ? new Date(dto.publishedDate)
          : undefined,
      });

      const savedBook = await this.bookRepository.save(newBook);

      return await this.bookRepository.findOneOrFail({
        where: { id: savedBook.id },
        relations: ['author'],
      });
    } catch (error) {
      throw new ConflictException('Gagal membuat buku', { cause: error });
    }
  }

  async update(id: number, dto: UpdateBookDTO): Promise<BookEntity> {
    try {
      const existingBook = await this.bookRepository.findOneBy({ id });
      if (!existingBook) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      const bookData = this.bookRepository.merge(existingBook, dto);
      return await this.bookRepository.save(bookData);
    } catch (error) {
      throw new Error(error);
    }
  }
}
