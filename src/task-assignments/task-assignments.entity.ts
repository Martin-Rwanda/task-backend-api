import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Task } from 'src/tasks/tasks.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class TaskAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, task => task.assignments, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: 'ASSIGNEE' })
  role: 'ASSIGNEE' | 'REVIEWER' | 'WATCHER';

  @ManyToOne(() => User)
  assignedBy: User;

  @CreateDateColumn()
  assignedAt: Date;
}
