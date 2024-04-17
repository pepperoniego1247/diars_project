import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";
import { OrderEntryDetail } from "./orderEntryDetail";

@Entity()
export class OrderEntry extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @ManyToOne(() => Employee, (employee) => employee.orderEntrys)
    employee: Employee;

    @OneToMany(() => OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.orderEntry)
    orderEntryDetails: OrderEntryDetail[];
    
    @Column()
    activo: boolean;
}