import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Products } from "./Products";

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Products, (product) => product.prices)
  product!: Products;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  sale_price!: number;

  @Column({ type: "varchar", length: 3 })
  currency!: string;
}
