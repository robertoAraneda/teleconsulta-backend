import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  run: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
