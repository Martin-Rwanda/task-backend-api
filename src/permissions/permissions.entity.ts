import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
        unique: true
    })
  name: string;

  @Column({
        type: 'text',
        nullable: true
    })
  description: string;
}