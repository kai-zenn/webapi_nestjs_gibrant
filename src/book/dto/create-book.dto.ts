import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDTO {
  @IsNotEmpty({ message: 'Judul tidak boleh kosong' })
  @IsString()
  title: string;

  @IsString({ message: 'Deskripsi tidak boleh kosong' })
  @IsOptional()
  description?: string;

  @IsUUID()
  authorId: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: string;
}
