import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Price } from "./Price";
import { ProductTranslations } from "./ProductTranslations";

@Entity()
export class Products {
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

  @OneToMany(() => ProductTranslations, (translation) => translation.product)
  translations!: ProductTranslations[];

  @OneToMany(() => Price, (price) => price.product)
  prices!: Price[];

  @Column({ type: "int" })
  quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
