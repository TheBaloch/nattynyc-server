import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Product } from "./Product";
import { CollectionTranslations } from "./CollectionTranslations";

@Entity()
export class Collections {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @Column({ type: "varchar" })
  name!: string;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products!: Product[];

  @OneToMany(
    () => CollectionTranslations,
    (translation) => translation.collection
  )
  translations!: CollectionTranslations[];

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
