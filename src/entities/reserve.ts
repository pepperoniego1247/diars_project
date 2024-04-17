import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";
import { Customer } from "./customer";
import { ReserveDetail } from "./reserveDetail";
import { Sale } from "./sale";

@Entity()
export class Reserve extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    reserveDate: Date;

    @Column()
    initionDate: Date;
    
    @Column()
    expitarionDate: Date;

    @ManyToOne(() => Employee, (employee) => employee.reserves)
    asignedEmployee: Employee
    
    @ManyToOne(() => Customer, (customer) => customer.reserves)
    asignedCustomer: Customer;

    @OneToMany(() => ReserveDetail, (reserveDetail) => reserveDetail.reserve)
    reserveDetails: ReserveDetail[]
   
    @Column()
    activo: boolean;    
}