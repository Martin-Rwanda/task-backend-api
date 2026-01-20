import { Task } from "src/tasks/tasks.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    performedBy: User;
    
    @Column()
    action: string; // CREATE | UPDATE | DELETE | STATUS_CHANGE
    
    @Column()
    entityType: string; // 'TASK' | 'PROJECT' | 'BOARD'

    @Column()
    entityId: number;

    @ManyToOne(() => Task, task => task.assignments)
    task: Task;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn() 
    performedAt: Date;
}
