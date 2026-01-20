import { Permission } from "src/permissions/permissions.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];

  @Column({ default: 'GLOBAL' })
  scope: 'GLOBAL' | 'PROJECT';

  @Column({ default: true })
  isActive: boolean;
}