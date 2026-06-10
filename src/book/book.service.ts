import { Injectable, NotFoundException } from '@nestjs/common';
import { BookEntity } from './book.entity';
import { CreateBookDTO } from './DTOs/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDTO } from './DTOs/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async findAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async create(dto: CreateBookDTO): Promise<BookEntity> {
    try {
      const newBook = this.bookRepository.create(dto);
      return await this.bookRepository.save(newBook);
    } catch (error) {
      throw new Error(error);
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
