import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./sale";
import { ReserveDetail } from "./reserveDetail";

@Entity()
export class SaleDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    subTotal: number;

    @ManyToOne(() => Sale, (sale) => sale.saleDetails)
    sale: Sale;

    @OneToOne(() => ReserveDetail)
    @JoinColumn()
    reserveDetail: ReserveDetail;
}