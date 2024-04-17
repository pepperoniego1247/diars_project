import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 150 })
    email: string;

    @Column({ length: 60 })
    password: string;

    @Column({ length: 70 })
    type: string;

    @OneToOne(() => Employee)
    @JoinColumn()
    employee: Employee;
}