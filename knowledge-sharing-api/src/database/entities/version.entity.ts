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

@Entity('versions')
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  versionNumber: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  changeSummary?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Column()
  articleId: string;

  @ManyToOne(() => Article, (article) => article.versions)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column()
  authorId: string;

  @ManyToOne(() => User, (user) => user.versions)
  @JoinColumn({ name: 'authorId' })
  author: User;
}
