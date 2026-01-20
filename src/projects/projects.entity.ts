import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Board } from 'src/boards/boards.entity';
import { ProjectUser } from 'src/project-user/project-user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @OneToMany(() => Board, board => board.project)
  boards: Board[];

  @OneToMany(() => ProjectUser, pu => pu.project)
  projectUsers: ProjectUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
