import express from "express";
import passport from "../middlewares/authentication/jwt";
import {
  addProduct,
  deleteProductByID,
  getProductBySlug,
  getProducts,
  updateProductByID,
} from "../controllers/productController";

const router = express.Router();

router.get("/product", getProducts);
router.get("/product/:slug", getProductBySlug);

router.post(
  "/product",
  //passport.authenticate("jwt", { session: false }),
  addProduct
);

router.put(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  updateProductByID
);

router.delete(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  deleteProductByID
);

export default router;
