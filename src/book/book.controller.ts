import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';

@Controller('/api/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Get()
  async findAll() {
    try {
      const books = await this.bookService.findAll();
      const mappedBooks = books.map((book) => ({
        id: book.id,
        title: book.title,
        description: book.description,
        author: book.author ? book.author.username : 'Unknown',
        publishedDate: book.publishedDate,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      }));
      return {
        success: true,
        data: mappedBooks,
        message: 'Data buku berhasil ditemukan',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data buku',
        error: error.message,
      };
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const data = await this.bookService.findOne(+id);
      const mappedData = {
        id: data.id,
        title: data.title,
        description: data.description,
        author: data.author ? data.author.username : 'Unknown',
        publishedDate: data.publishedDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      return {
        success: true,
        data: mappedData,
        message: 'Data buku berhasil ditemukan',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
  @Post()
  async create(@Body() book: CreateBookDTO) {
    try {
      const data = await this.bookService.create(book);
      return {
        success: true,
        data: {
          id: data.id,
          title: data.title,
          description: data.description,
          author: data.author ? data.author.username : 'Unknown',
          publishedDate: data.publishedDate,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        message: 'Buku berhasil ditambahkan',
      };
    } catch (error) {
      return {
        success: false,
        error: new ConflictException('Gagal membuat buku', { cause: error }),
      };
    }
  }
  @Patch(':id')
  async update(@Param('id') id: number, @Body() book: UpdateBookDTO) {
    try {
      const data = await this.bookService.update(+id, book);
      return {
        success: true,
        data,
        message: 'Buku berhasil diperbarui',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
