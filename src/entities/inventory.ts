import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Product } from "./product";
import { OrderEntryDetail } from "./orderEntryDetail";
import { ProductSaleDetail } from "./productSaleDetail";

@Entity()
export class Inventory extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column()
    status: boolean;

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;

    @OneToMany(() => OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.inventory)
    orderEntryDetails: OrderEntryDetail[];

    @OneToMany(() => ProductSaleDetail, (productSaleDetail) => productSaleDetail.inventory)
    productSaleDetails: ProductSaleDetail[];
}