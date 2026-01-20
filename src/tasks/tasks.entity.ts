import { AuditLog } from "src/audit-logs/audit-logs.entity";
import { Board } from "src/boards/boards.entity";
import { Project } from "src/projects/projects.entity";
import { TaskAssignment } from "src/task-assignments/task-assignments.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'enum', enum: ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED'], default: 'PENDING' })
    status: TaskStatus;

    @Column({ type: 'enum', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' })
    priority: TaskPriority;

    @ManyToOne(() => Board, board => board.tasks, { onDelete: 'CASCADE' })
    board: Board;

    @ManyToOne(() => Project)
    project: Project;

    @ManyToOne(() => User)
    createdBy: User;

    @OneToMany(() => TaskAssignment, ta => ta.task)
    assignments: TaskAssignment[];

    @OneToMany(() => AuditLog, al => al.task)
    auditLogs: AuditLog[];

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({ type: 'int', nullable: true })
    slaHours: number;

    @Column({ default: false })
    isOverdue: boolean;

    @CreateDateColumn() createdAt: Date;
    @UpdateDateColumn() updatedAt: Date;
}