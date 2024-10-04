import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Collections } from "./Collections";

@Entity()
export class CollectionTranslations {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Collections, (collection) => collection.translations)
  collection!: Collections;

  @Column({ type: "varchar", length: 10 })
  locale!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;
}
