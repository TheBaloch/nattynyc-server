import { AppDataSource } from "../../config/database";
import { SiteSettings } from "../../entities/SiteSettings";

export async function initSettings() {
  const settings = await AppDataSource.getRepository(SiteSettings).find();
  if (!settings || settings.length <= 0) {
    await AppDataSource.getRepository(SiteSettings).save(new SiteSettings());
  }
}
