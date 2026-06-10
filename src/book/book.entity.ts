import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm/browser';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column({ type: 'date', nullable: true })
  @Column()
  publishedDate: Date;

  @CreateDateColumn()
  @Column()
  createdAt: Date;

  @CreateDateColumn()
  @Column()
  updatedAt: Date;
}
