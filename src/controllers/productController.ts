import { AppDataSource } from "../config/database";
import { Request, Response } from "express";
import { Price } from "../entities/Price";
import { ProductTranslation } from "../entities/ProductTranslation";
import { Product } from "../entities/Product";
import { addAProduct } from "../utils/product/addAProduct";

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
      body,
      seo_title,
      seo_description,
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
      Prices.push(price);
    }

    if (Prices.length === 0) {
      return res.status(400).json({ message: "No valid prices provided" });
    }

    const savedProduct = await addAProduct(
      image,
      gallery,
      status,
      parsedQuantity,
      Prices,
      name,
      vendor,
      category,
      tags,
      body,
      ""
    );
    if (!savedProduct)
      res.status(308).json({ message: "Failed Check Server Logs" });
    return res.status(200).json({ message: "Sucess", data: savedProduct });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({
      relations: ["prices", "translations"],
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
