import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.prices, {
    onDelete: "CASCADE",
  })
  product!: Product;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  sale_price!: number;

  @Column({ type: "varchar", length: 3 })
  currency!: string;
}
