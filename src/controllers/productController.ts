import { AppDataSource } from "../config/database";
import { Request, Response } from "express";
import { Price } from "../entities/Price";
import { ProductTranslation } from "../entities/ProductTranslation";
import { Product } from "../entities/Product";
import { Vendor } from "../entities/Vendor";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      image,
      gallery = [],
      status = "draft",
      quantity,
      prices,
      name,
      vendor,
      category,
      tags = [],
      body = null,
      seo_title = null,
      seo_description = null,
    } = req.body;

    // Validate required fields
    if (!image || !quantity || !prices || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse and validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Parse and validate prices
    const priceRepository = AppDataSource.getRepository(Price);
    const Prices: Price[] = [];
    for (const p of prices) {
      if (!p.price || !p.currency) {
        return res
          .status(400)
          .json({ message: "Price and currency are required" });
      }

      const parsedPrice = parseFloat(p.price);
      const parsedSalePrice = parseFloat(p.sale_price) || 0.0;

      if (isNaN(parsedPrice) || isNaN(parsedSalePrice)) {
        return res.status(400).json({ message: "Invalid price or sale price" });
      }

      const price = new Price();
      price.price = parsedPrice;
      price.sale_price = parsedSalePrice;
      price.currency = p.currency;
      Prices.push(await priceRepository.save(price));
    }

    if (Prices.length === 0) {
      return res.status(400).json({ message: "No valid prices provided" });
    }

    // Handle translations
    const productTranslationRepository =
      AppDataSource.getRepository(ProductTranslation);
    let productTranslation = new ProductTranslation();
    productTranslation.locale = "en";
    productTranslation.name = name;
    productTranslation.body = body;
    productTranslation.category = category;
    productTranslation.tags = tags;
    productTranslation.seo_title = seo_title;
    productTranslation.seo_description = seo_description;
    productTranslation = await productTranslationRepository.save(
      productTranslation
    );

    const productsRepository = AppDataSource.getRepository(Product);
    let product = new Product();

    // Ensure unique slug
    let slug = slugify(name);
    let existing = await productsRepository.findOne({ where: { slug } });

    for (let i = 1; existing; i++) {
      slug = slugify(`${name}-${i}`);
      existing = await productsRepository.findOne({ where: { slug } });
    }

    // Validate and set status
    const validStatuses = ["active", "inactive", "draft"];
    product.status = validStatuses.includes(status) ? status : "draft";

    // Set product fields
    product.slug = slug;
    product.image = image;
    product.gallery = gallery;
    product.quantity = parsedQuantity;
    product.translations = [productTranslation];
    product.prices = Prices;

    if (vendor) {
      const vendorRepository = AppDataSource.getRepository(Vendor);
      const existingVendor = await vendorRepository.findOne({
        where: { name: vendor },
      });
      if (existingVendor) product.vendor = existingVendor;
      else {
        let newVendor = new Vendor();
        newVendor.name = vendor;
        newVendor = await vendorRepository.save(newVendor);
        product.vendor = newVendor;
      }
    }

    // Save product
    product = await productsRepository.save(product);

    return res.status(200).json({ message: "Success", data: product });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({
      relations: ["prices", "translations", "vendor"],
    });
    return res.status(200).json({ message: "Hello", data: products });
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
