import { DataSource } from "typeorm";

import { Users } from "../entities/Users";
import { SiteSettings } from "../entities/SiteSettings";
import { Product } from "../entities/Product";
import { ProductTranslation } from "../entities/ProductTranslation";
import { Price } from "../entities/Price";
import { Collections } from "../entities/Collections";
import { CollectionTranslations } from "../entities/CollectionTranslations";

import * as dotenv from "dotenv";
import { Vendor } from "../entities/Vendor";

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
    Product,
    ProductTranslation,
    Price,
    Collections,
    CollectionTranslations,
    Vendor,
  ],
  synchronize: process.env.DB_SYNCHRONIZE === "true",
});
