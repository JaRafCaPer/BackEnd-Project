import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controllers/product.controllers.js";
import {requireAdmin} from "../middleware/rol.verification.js";

import { Router } from "express";
import passport from "passport";
const router = Router();

router.get(
  "/",

  passport.authenticate("jwt", { session: false }),

  getProducts
);
// router.get(
//   "/realtimeProducts",
//   passport.authenticate("jwt", { session: false }),
//   getProductsRealTime
// );
router.get(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  getProductById
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),requireAdmin,
  createProduct
);
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),requireAdmin,
  updateProductById
);
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),requireAdmin,
  deleteProductById
);



export default router;