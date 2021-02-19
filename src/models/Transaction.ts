import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  type: 'income' | 'outcome';

  @Column('float')
  value: number;

  @ManyToOne(_ => Category, {
    cascade: ['insert', 'update'],
    primary: false,
    eager: true,
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'title',
  })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
