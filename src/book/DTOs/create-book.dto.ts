import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';


export class CreateBookDTO {
  @IsNotEmpty({ message: 'Judul tidak boleh kosong' })
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: string;
}
