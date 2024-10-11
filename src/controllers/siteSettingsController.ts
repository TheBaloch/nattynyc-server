import { AppDataSource } from "../config/database";
import { Request, Response } from "express";
import { SiteSettings } from "../entities/SiteSettings";

let globals: SiteSettings;

export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    if (globals) return res.status(200).json(globals);
    const siteSettingsRepository = AppDataSource.getRepository(SiteSettings);
    const settings = await siteSettingsRepository.find();
    if (settings.length <= 0) {
      await siteSettingsRepository.save(new SiteSettings());
      const newSettings = await siteSettingsRepository.find();
      return res.status(200).json(newSettings);
    } else {
      globals = settings[0];
      return res.status(200).json(settings[0]);
    }
  } catch (error) {
    console.error("", error);
    return res.status(500).json({ message: "", error });
  }
};

export const updateSiteSettings = async (req: Request, res: Response) => {
  try {
    const {
      locales,
      currencies,
      siteKeywords,
      defaultLocale,
      translationEnabled,
      activeTranslationEnabled,
      defaultCurrency,
      multiCurrencyEnabled,
      siteTitle,
      siteDescription,
      siteURL,
      faviconURL,
      defaultMetaTitle,
      defaultMetaDescription,
      ogTitle,
      ogDescription,
      ogImageURL,
      ogType,
      ogURL,
      aiProductOptimization,
    } = req.body;
    const siteSettingsRepository = AppDataSource.getRepository(SiteSettings);
    const settings = await siteSettingsRepository.find();

    settings[0].activeTranslationEnabled = activeTranslationEnabled;
    settings[0].translationEnabled = translationEnabled;
    settings[0].currencies = currencies;
    settings[0].defaultCurrency = defaultCurrency;
    settings[0].defaultLocale = defaultLocale;
    settings[0].defaultMetaDescription = defaultMetaDescription;
    settings[0].defaultMetaTitle = defaultMetaTitle;
    settings[0].faviconURL = faviconURL;
    settings[0].locales = locales;
    settings[0].multiCurrencyEnabled = multiCurrencyEnabled;
    settings[0].ogDescription = ogDescription;
    settings[0].ogImageURL = ogImageURL;
    settings[0].ogTitle = ogTitle;
    settings[0].ogType = ogType;
    settings[0].ogURL = ogURL;
    settings[0].siteDescription = siteDescription;
    settings[0].siteKeywords = siteKeywords;
    settings[0].siteTitle = siteTitle;
    settings[0].siteURL = siteURL;
    settings[0].aiProductOptimization = aiProductOptimization;
    const updatedSettings = await siteSettingsRepository.save(settings[0]);
    globals = updatedSettings;
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("", error);
    return res.status(500).json({ message: "", error });
  }
};
