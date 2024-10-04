import { AppDataSource } from "../config/database";
import { Request, Response } from "express";
import { Price } from "../entities/Price";
import { ProductTranslations } from "../entities/ProductTranslations";
import { Products } from "../entities/Products";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name, // required
      quantity, // required
      image, // required
      gallery, // nullable
      status, // required
      prices, // important
      body, // nullable
      vendor, // nullable
      category, // nullable
      tags, // nullable
      seo_title, // nullable
      seo_description, // nullable
    } = req.body;

    // Validate required fields
    if (!name || !quantity || !image || !prices || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productsRepo = AppDataSource.getRepository(Products);
    let product = new Products();

    // Handle translations
    const productTranslation = new ProductTranslations();
    productTranslation.locale = "en";
    productTranslation.name = name;
    productTranslation.body = body || null;
    productTranslation.category = category || null;
    productTranslation.tags = tags || null;
    productTranslation.seo_title = seo_title || null;
    productTranslation.seo_description = seo_description || null;
    productTranslation.vendor = vendor || null;

    // Ensure unique slug
    let slug = slugify(name);
    let existing = await productsRepo.findOne({ where: { slug } });

    for (let i = 1; existing; i++) {
      slug = slugify(`${name}-${i}`);
      existing = await productsRepo.findOne({ where: { slug } });
    }

    // Set product properties
    product.slug = slug;
    product.image = image;
    product.gallery = gallery || []; // Handle nullable gallery
    product.quantity = parseInt(quantity) || 100; // Default to 100 if null
    product.status = status;
    product.translations = [productTranslation];

    // Handle prices array
    const Prices: Price[] = [];
    for (const p of prices) {
      if (!p.price || !p.currency) {
        continue; // Skip invalid prices
      }
      try {
        const price = new Price();
        price.product = product;
        price.price = p.price;
        price.sale_price = p.sale_price || null; // Optional sale_price
        price.currency = p.currency;
        Prices.push(price);
      } catch (error) {
        console.log("Error while adding price", error);
      }
    }

    // Check that valid prices are available
    if (Prices.length === 0) {
      return res.status(400).json({ message: "Invalid price data" });
    }

    product.prices = Prices;

    // Save the product to the repository
    product = await productsRepo.save(product);

    return res.status(200).json({ message: "Success", data: product });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "Hello" });
  } catch (error) {
    console.error("", error);
    return res.status(500).json({ message: "", error });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    return res.status(200).json({ message: slug });
  } catch (error) {
    console.error("", error);
    return res.status(500).json({ message: "", error });
  }
};

export const updateProductByID = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "" });
  } catch (error) {
    console.error("", error);
    return res.status(500).json({ message: "", error });
  }
};

export const deleteProductByID = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "" });
  } catch (error) {
    console.error("", error);
    return res.status(500).json({ message: "", error });
  }
};

function slugify(text: string) {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[\s_]+/g, "-") // Replace spaces or underscores with a hyphen
    .replace(/[^\w\-0-9]+/g, "") // Remove all non-word characters except letters, numbers, and hyphens
    .replace(/\-\-+/g, "-"); // Replace multiple hyphens with a single one
}
