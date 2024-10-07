import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "json" })
  locales: string[] = ["en"];

  @Column({ type: "json" })
  currencies: string[] = ["USD"];

  @Column({ type: "varchar", length: 255, nullable: true })
  siteTitle!: string;

  @Column({ type: "text", nullable: true })
  siteDescription!: string;

  @Column({ type: "json", nullable: true })
  siteKeywords!: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  siteURL!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  faviconURL!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  defaultMetaTitle!: string;

  @Column({ type: "text", nullable: true })
  defaultMetaDescription!: string;

  @Column({ type: "json", nullable: true })
  defaultMetaKeywords!: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  ogTitle!: string;

  @Column({ type: "text", nullable: true })
  ogDescription!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ogImageURL!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ogType!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ogURL!: string;
}
