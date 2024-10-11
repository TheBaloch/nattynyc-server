import { AppDataSource } from "../../config/database";
import { Price } from "../../entities/Price";
import { Product } from "../../entities/Product";
import { ProductTranslation } from "../../entities/ProductTranslation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SiteSettings } from "../../entities/SiteSettings";
import OpenAI from "openai";

export async function translateAProduct(
  image: string,
  gallery: string[],
  status: "draft" | "active" | "inactive",
  Quantity: number,
  Prices: Price[],
  name: string,
  vendor: string,
  category: string,
  tags: string[],
  body: string,
  productType: string
) {
  try {
    const settings = await AppDataSource.getRepository(SiteSettings).find();
    const siteSetting = settings[0];
    const productRepository = AppDataSource.getRepository(Product);
    const productTranslationRepository =
      AppDataSource.getRepository(ProductTranslation);
    const priceRepository = AppDataSource.getRepository(Price);

    //making a unique slug
    let slug = slugify(name);
    let existing = await productRepository.findOne({ where: { slug } });
    for (let i = 1; existing; i++) {
      slug = slugify(`${name}-${i}`);
      existing = await productRepository.findOne({ where: { slug } });
    }
    //making a unique slug end

    let product = new Product();
    product.slug = slug;
    product.quantity = Quantity;
    product.status = status;
    product.image = image;
    product.gallery = gallery;

    if (siteSetting.aiProductOptimization) {
      const optimizedProduct = await OptimizeProduct(
        name,
        vendor,
        category,
        tags,
        body
      );

      const productTranslation = new ProductTranslation();
      productTranslation.locale = "en";
      productTranslation.body = optimizedProduct.body;
      productTranslation.category = optimizedProduct.category;
      productTranslation.name = optimizedProduct.name;
      productTranslation.seo_description = optimizedProduct.seo_description;
      productTranslation.seo_title = optimizedProduct.seo_title;
      productTranslation.tags = optimizedProduct.tags;
      productTranslation.vendor = optimizedProduct.vendor;
      productTranslation.type = optimizedProduct.productType;

      product.translations = [
        await productTranslationRepository.save(productTranslation),
      ];
    } else {
      const productTranslation = new ProductTranslation();
      productTranslation.locale = "en";
      productTranslation.body = body;
      productTranslation.category = category;
      productTranslation.name = name;
      productTranslation.seo_title = name;
      productTranslation.tags = tags;
      productTranslation.vendor = vendor;
      productTranslation.type = productType;

      product.translations = [
        await productTranslationRepository.save(productTranslation),
      ];
    }
    const savedPrices: Price[] = [];
    for (const p of Prices) {
      savedPrices.push(await priceRepository.save(p));
    }
    product.prices = savedPrices;
    product = await productRepository.save(product);
    return product;
  } catch (error) {
    console.error("Error while adding and optimizing Product");
  }
}

async function OptimizeProduct(
  name: string,
  vendor: string,
  category: string,
  tags: string[],
  body: string
): Promise<{
  name: string;
  vendor: string;
  category: string;
  productType: string;
  tags: string[];
  body: string;
  seo_title: string;
  seo_description: string;
}> {
  let optimizedContent;
  try {
    optimizedContent = await retry(optimizeProductWithGemini, [
      name,
      vendor,
      category,
      tags,
      body,
    ]);
  } catch {
    optimizedContent = await retry(optimizeProductWithOpenAI, [
      name,
      vendor,
      category,
      tags,
      body,
    ]);
  }
  return optimizedContent;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-0-9]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function optimizeProductWithGemini(
  name: string,
  vendor: string,
  category: string,
  tags: string[],
  body: string
): Promise<{
  name: string;
  vendor: string;
  category: string;
  productType: string;
  tags: string[];
  body: string;
  seo_title: string;
  seo_description: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const schema: any = {
    description: "Schema for optimized product content response",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Optimized product name, if needed",
        nullable: false,
      },
      vendor: {
        type: "string",
        description: "Corrected vendor name, if needed",
        nullable: false,
      },
      category: {
        type: "string",
        description: "Product category (unchanged)",
        nullable: false,
      },
      productType: {
        type: "string",
        description: "Type of the product (e.g., Serum, Cream, Electronics)",
        nullable: false,
      },
      tags: {
        type: "array",
        items: {
          type: "string",
          description: "Optimized relevant tags (max 5)",
          nullable: false,
        },
        description:
          "Array of relevant tags for improved SEO visibility (max 5)",
        nullable: false,
      },
      body: {
        type: "string",
        description:
          "Optimized product description in HTML format, including dynamic sections",
        nullable: false,
      },
      seo_title: {
        type: "string",
        description: "Optimized SEO-friendly title for better visibility",
        nullable: false,
      },
      seo_description: {
        type: "string",
        description:
          "Optimized SEO-friendly description for better click-through rate",
        nullable: false,
      },
    },
    required: [
      "name",
      "vendor",
      "category",
      "productType",
      "tags",
      "body",
      "seo_title",
      "seo_description",
    ],
  };

  const systemInstructions = `You are an expert in product content optimization, specializing in dynamic content creation for various types of products. Your task is to optimize product information by enhancing the name, vendor, tags, and body content while generating SEO-friendly titles and descriptions. The goal is to provide concise, clear, and engaging content that addresses all key buyer concerns without overwhelming them.

  Instructions:
  1. **Product Name**: Optimize only if necessary for clarity and engagement.
  2. **Vendor Name**: Correct spelling or formatting if needed.
  3. **Tags**: Keep only highly relevant tags (up to 5) to improve searchability.
  4. **Body Content**: 
     - Transform the body content into clean HTML using <h>, <p>, <ul>, <li>, <strong>, and similar tags.
     - Optimize content for readability, engagement, and SEO.
     - Ensure Body covers all acpects of Product a buyer needs to form a decision without overwelming them
  5. **SEO Title**: Create an attention-grabbing SEO title to improve visibility and clicks.
  6. **SEO Description**: Write a concise, persuasive description to improve click-through rates (focus on buyer intent and pain points).
  7. **Customer-Centric Focus**: Consider the type of buyer (e.g., health-conscious for skincare, tech-savvy for electronics) and highlight relevant benefits.
  8. Ensure the content is dynamic, fits the product type, and remains concise and appealing.`;

  const prompt = `Optimize the following product data for SEO, ensuring the content is dynamic, informative, and targeted to a potential buyer’s needs:
${JSON.stringify({
  name,
  vendor,
  category,
  tags,
  body,
})}

Expected output:
- Optimized product name (if needed)
- Corrected vendor name (if needed)
- Optimized and relevant tags (max 5)
- Optimized body content in HTML format, dynamically including sections like "How to Use",  "Ingredients", and "FAQs" where applicable
- Optimized SEO title
- Optimized SEO description
- Ensure the content addresses potential buyer concerns without overwhelming them.`;
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstructions,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      topP: 0.9,
      responseSchema: schema,
      presencePenalty: 0.0,
    },
  });
  const result = await model.generateContent(JSON.stringify(prompt));
  const optimizedContent: {
    name: string;
    vendor: string;
    category: string;
    productType: string;
    tags: string[];
    body: string;
    seo_title: string;
    seo_description: string;
  } = JSON.parse(result.response.text());
  return optimizedContent;
}

async function optimizeProductWithOpenAI(
  name: string,
  vendor: string,
  category: string,
  tags: string[],
  body: string
): Promise<{
  name: string;
  vendor: string;
  category: string;
  productType: string;
  tags: string[];
  body: string;
  seo_title: string;
  seo_description: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }
  const openai = new OpenAI({
    apiKey,
  });

  const schema = {
    name: "The optimized product name (concise and engaging).",
    vendor: "The vendor name, corrected for spelling or formatting.",
    category:
      "The product category (unchanged, but correct any spelling mistakes).",
    productType: "Type of product (e.g., Serum, Cream, Electronics, etc.).",
    tags: "Array of optimized, relevant tags for search (max 5).",
    body: "Optimized product description in **condensed HTML** format, with clear sections like 'How to Use', 'Ingredients', 'Specifications', and 'FAQs'.",
    seo_title: "Optimized SEO-friendly title (max 60 characters).",
    seo_description:
      "SEO-friendly meta description to improve click-through rates (max 160 characters).",
  };

  const systemInstructions = `
   You are an expert in product content optimization, specializing in dynamic content creation for various types of products. Your task is to optimize product information by enhancing the name, vendor, tags, and body content while generating SEO-friendly titles and descriptions. The goal is to provide concise, clear, and engaging content that addresses all key buyer concerns without overwhelming them.
  Instructions:
  1. **Product Name**: Optimize only if necessary for clarity and engagement.
  2. **Vendor Name**: Correct spelling or formatting if needed.
  3. **Tags**: Keep only highly relevant tags (up to 5) to improve searchability.
  4. **Body Content**: 
     - Transform the body content into clean HTML using <h>, <p>, <ul>, <li>, <strong>, and similar tags.
     - Optimize content for readability, engagement, and SEO.
     - Ensure Body covers all aspects of Product a buyer needs to form a decision without overwhelming them.
  5. **SEO Title**: Create an attention-grabbing SEO title to improve visibility and clicks.
  6. **SEO Description**: Write a concise, persuasive description to improve click-through rates (focus on buyer intent and pain points).
  7. **Customer-Centric Focus**: Consider the type of buyer (e.g., health-conscious for skincare, tech-savvy for electronics) and highlight relevant benefits.
  8. Ensure the content is dynamic, fits the product type, and remains concise and appealing.
  9. The body should not include the product name.
    The output should be in JSON in this schema: ${JSON.stringify(schema)}
  `;

  const prompt = `Optimize the following product data for SEO, ensuring the content is dynamic, informative, and targeted to a potential buyer’s needs:
    ${JSON.stringify({
      name,
      vendor,
      category,
      tags,
      body,
    })}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemInstructions },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 0.7,
  });

  const response = completion.choices[0].message.content;

  const optimizedContent: {
    name: string;
    vendor: string;
    category: string;
    productType: string;
    tags: string[];
    body: string;
    seo_title: string;
    seo_description: string;
  } = JSON.parse(response || "");
  return optimizedContent;
}

/**
 * Retry logic for translation functions.
 * @param fn - The function to be retried.
 * @param args - Arguments for the function.
 * @param retries - Number of retries.
 */
async function retry<T>(
  fn: (...args: any[]) => Promise<T>,
  args: any[],
  retries: number = 3
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn(...args);
    } catch (error: any) {
      lastError = error;
      console.warn(`Retry attempt ${attempt + 1} failed: ${error.message}`);
      if (attempt === retries - 1) {
        throw lastError;
      }
    }
  }
  throw lastError;
}
