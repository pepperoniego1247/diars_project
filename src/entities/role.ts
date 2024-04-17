import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 70 })
    name: string;

    @Column()
    payment: number;

    @OneToMany(() => Employee, (employee) => employee.role)
    employees: Employee[];
}