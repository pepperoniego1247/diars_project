import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntryDetail } from "./orderEntryDetail";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;
    
    @Column()
    category: string;

    @Column()
    price: number;

    @Column()
    activo: boolean;

    @OneToMany(() => OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.product)
    orderEntryDetails: OrderEntryDetail[];
}