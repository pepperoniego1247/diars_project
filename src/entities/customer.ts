import { BaseEntity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Person } from "./person";
import { Reserve } from "./reserve";

@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    email: string;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToMany(() => Reserve, (reserve) => reserve.asignedCustomer)
    reserves: Reserve[]
}