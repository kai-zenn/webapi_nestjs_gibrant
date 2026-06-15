import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong' })
  @IsString()
  body: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  postId: number;
}
