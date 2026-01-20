import { Task } from "src/tasks/tasks.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @ManyToOne(() => Task)
    task: Task;

    @ManyToOne(() => User)
    createdBy: User;

    @CreateDateColumn() 
    createdAt: Date;
}
