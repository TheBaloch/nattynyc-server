import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Price } from "./Price";
import { ProductTranslation } from "./ProductTranslation";
import { Vendor } from "./Vendor";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  slug!: string;

  @Column({ type: "text" })
  image!: string;

  @Column({ type: "text", nullable: true })
  gallery!: string[];

  @Column({ type: "varchar" })
  status!: "active" | "draft" | "inactive";

  @OneToMany(() => ProductTranslation, (translation) => translation.product)
  translations!: ProductTranslation[];

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  vendor!: Vendor;

  @OneToMany(() => Price, (price) => price.product)
  prices!: Price[];

  @Column({ type: "int" })
  quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
