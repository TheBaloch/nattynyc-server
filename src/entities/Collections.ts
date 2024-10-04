import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Products } from "./Products";
import { CollectionTranslations } from "./CollectionTranslations";

@Entity()
export class Collections {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @ManyToMany(() => Products, { cascade: true })
  @JoinTable()
  products!: Products[];

  @OneToMany(
    () => CollectionTranslations,
    (translation) => translation.collection
  )
  translations!: CollectionTranslations[];

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
