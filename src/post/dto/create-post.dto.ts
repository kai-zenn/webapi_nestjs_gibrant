import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty({ message: 'Judul tidak boleh kosong' })
  @IsString()
  title: string;

  @IsString({ message: 'Isi konten tidak boleh kosong' })
  content: string;

  @IsUUID()
  authorId: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: string;
}
