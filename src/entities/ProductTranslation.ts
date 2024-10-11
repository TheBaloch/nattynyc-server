import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class ProductTranslation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.translations, {
    onDelete: "CASCADE",
  })
  product!: Product;

  @Column({ type: "varchar", length: 10 })
  locale!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  category!: string;

  @Column({ type: "text", nullable: true })
  vendor!: string;

  @Column({ type: "text", nullable: true })
  type!: string;

  @Column({ type: "json", nullable: true })
  tags!: string[];

  @Column({ type: "text", nullable: true })
  body!: string;

  @Column({ type: "text", nullable: true })
  seo_title!: string;

  @Column({ type: "text", nullable: true })
  seo_description!: string;
}
