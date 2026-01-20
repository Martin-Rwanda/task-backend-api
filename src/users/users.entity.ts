import { Exclude } from "class-transformer";
import { Permission } from "src/permissions/permissions.entity";
import { ProjectUser } from "src/project-user/project-user.entity";
import { Role } from "src/roles/roles.entuty";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false
    })
    firstName: string;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false
    })
    lastName: string;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
        unique: true
    })
    email: string;

    @Exclude()
    @Column({
        type: 'varchar',
        length: 96,
        nullable: false
    })
    password: string;

    @Column({
        type: 'boolean',
        nullable: true,
        default: true
    })
    isActive: boolean;

    @ManyToMany(() => Role)
    @JoinTable({ name: 'user_roles' })
    roles: Role[];

    @OneToMany(() => ProjectUser, pu => pu.user)
    projectUsers: ProjectUser[];

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true })
    hashedRefreshToken: string | null;
}