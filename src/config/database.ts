import { DataSource } from "typeorm";

import { Users } from "../entities/Users";
import { SiteSettings } from "../entities/SiteSettings";
import { Products } from "../entities/Products";
import { ProductTranslations } from "../entities/ProductTranslations";
import { Price } from "../entities/Price";
import { Collections } from "../entities/Collections";
import { CollectionTranslations } from "../entities/CollectionTranslations";

import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "database",
  entities: [
    Users,
    SiteSettings,
    Products,
    ProductTranslations,
    Price,
    Collections,
    CollectionTranslations,
  ],
  synchronize: process.env.DB_SYNCHRONIZE === "true",
});
