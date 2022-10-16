import express from "express";
import {vSession} from "../middleware/VerifyAuth.js" //utk verifikasi endpoint yg tidak dapat diakses jika tidak login

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/products",vSession, getProducts);
router.get("/products/:id",vSession, getProductById);
router.post("/products",vSession, createProduct);
router.patch("/products/:id",vSession, updateProduct);
router.delete("/products/:id",vSession, deleteProduct);

export default router;
