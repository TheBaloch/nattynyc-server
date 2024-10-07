import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @OneToMany(() => Product, (product) => product.vendor)
  products!: Product[];
}
