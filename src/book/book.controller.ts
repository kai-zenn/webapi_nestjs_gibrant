import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDTO } from './DTOs/create-book.dto';
import { UpdateBookDTO } from './DTOs/update-book.dto';

@Controller('/api/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Get()
  async findAll() {
    try {
      const books = await this.bookService.findAll();
      return {
        success: true,
        data: books,
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
      return {
        success: true,
        data,
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
        data,
        message: 'Buku berhasil ditambahkan',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
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
