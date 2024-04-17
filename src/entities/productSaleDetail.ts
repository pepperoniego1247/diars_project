import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "./inventory";
import { ProductSale } from "./productSale";

@Entity()
export class ProductSaleDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    subTotal: number;

    @ManyToOne(() => Inventory, (inventory) => inventory.productSaleDetails)
    inventory: Inventory;

    @ManyToOne(() => ProductSale, (productSale) => productSale.productSaleDetails)
    productSale: ProductSale;
}