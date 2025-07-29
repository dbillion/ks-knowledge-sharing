import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ default: 0 })
  downloadCount: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Column()
  articleId: string;

  @ManyToOne(() => Article, (article) => article.attachments)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column()
  uploadedById: string;

  @ManyToOne(() => User, (user) => user.attachments)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;
}
