import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer";
import { Process } from "./process";

@Entity()
export class Anamnesis extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
//la administradora pidio traducir toda la base de datos por que me puse terco con el ingles :v
    @OneToOne(() => Customer)
    @JoinColumn()
    customer: Customer;

    @Column()
    provenencia: string;

    @Column()
    queloide: boolean;
    
    @Column()
    lentesDeContacto: boolean;

    @Column()
    aspirinas: boolean;

    @Column()
    depresion: boolean;

    @Column()
    enfermedadesCardiovasculares: boolean;

    @Column()
    epilepsia: boolean;

    @Column()
    hipertension: boolean;

    @Column()
    problemasIntestinales: boolean;

    @Column()
    problemasRenales: boolean;

    @Column()
    problemasRespiratorios: boolean;

    @Column()
    problemasCirculatorios: boolean;

    @Column()
    alergias: boolean;

    @Column()
    tatuajes: boolean;

    @Column()
    hemofilia: boolean;

    @Column()
    cancer: boolean;

    @Column()
    vihPlus: boolean;

    @Column()
    marcaPasos: boolean;

    @Column()
    diabetes: boolean;

    @Column()
    glaucoma: boolean;

    @Column()
    embarazada: boolean;

    @Column()
    hepatitis: boolean;

    @Column()
    anemia: boolean;

    @Column()
    preguntaUno: string;
    
    @Column()
    respuestaUno: string;

    @Column()
    preguntaDos: string;
    
    @Column()
    respuestaDos: string;

    @Column()
    preguntaTres: string;
    
    @Column()
    respuestaTres: string;

    @Column()
    preguntaCuatro: string;
    
    @Column()
    respuestaCuatro: string;

    @Column()
    preguntaCinco: string;
    
    @Column()
    respuestaCinco: string;

    @Column()
    preguntaSeis: string;
    
    @Column()
    respuestaSeis: string;

    @OneToMany(() => Process, (process) => process.anamnesis)
    procedimientos: Process[];
}