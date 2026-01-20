import { Project } from "src/projects/projects.entity";
import { Role } from "src/roles/roles.entuty";
import { User } from "src/users/users.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Project)
    project: Project;

    @ManyToOne(() => Role)
    role: Role; // Defines project-specific permissions
}