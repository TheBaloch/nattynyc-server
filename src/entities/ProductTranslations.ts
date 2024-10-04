import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Products } from "./Products";

@Entity()
export class ProductTranslations {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Products, (product) => product.translations)
  product!: Products;

  @Column({ type: "varchar", length: 10 })
  locale!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  vendor!: string;

  @Column({ type: "text", nullable: true })
  category!: string;

  @Column({ type: "json", nullable: true })
  tags!: string[];

  @Column({ type: "text", nullable: true })
  body!: string;

  @Column({ type: "text", nullable: true })
  seo_title!: string;

  @Column({ type: "text", nullable: true })
  seo_description!: string;
}
