import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { ReserveDetail } from "./reserveDetail";
import { Service } from "./service";

@Entity()
export class MicroService extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToOne(() => ReserveDetail, (reserveDetail) => reserveDetail.microServices)
    reserveDetails: ReserveDetail;

    @ManyToOne(() => Service, (service) => service.microServices)
    service: Service;
}
