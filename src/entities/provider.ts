import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./person";
import { OrderEntryDetail } from "./orderEntryDetail";

@Entity()
export class Provider extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    ruc: string;

    @Column()
    address: string;

    @Column()
    name: string;

    @Column()
    phoneNumber: string;

    @OneToOne(() => Person)
    person: Person;

    @OneToMany(() => OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.provider)
    orderEntryDetails: OrderEntryDetail[];
}