import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Price } from "./Price";
import { ProductTranslation } from "./ProductTranslation";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  slug!: string;

  @Column({ type: "text" })
  image!: string;

  @Column({ type: "json", nullable: true })
  gallery!: string[];

  @Column({ type: "varchar" })
  status!: "active" | "draft" | "inactive";

  @OneToMany(() => ProductTranslation, (translation) => translation.product)
  translations!: ProductTranslation[];

  @OneToMany(() => Price, (price) => price.product)
  prices!: Price[];

  @Column({ type: "int" })
  quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
