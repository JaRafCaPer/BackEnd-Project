import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  getListProducts,
  searchProduct,
  updateProductStatus,
} from "../controllers/product.controllers.js";
import {requireAdmin, requireUser, requirePremium } from "../middleware/rol.verification.js";

import { Router } from "express";
import passport from "passport";
const router = Router();

router.get(  "/",  passport.authenticate("jwt", { session: false }),  getProducts);


router.get(
  "/addproducts",
  passport.authenticate("jwt", { session: false }),requirePremium,(req, res) => {
    
    let user = req.user;
    user = user.user
    res.render("realTimeProducts", {
     user
    });
  });


router.post("/addproducts", createProduct);

router.get('/listproducts', passport.authenticate("jwt", { session: false }), getListProducts)


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
  passport.authenticate("jwt", { session: false }), 
  deleteProductById
);

router.post("/search", passport.authenticate("jwt", { session: false }), searchProduct);

router.put(
  "/toggleStatus/:pid",
  passport.authenticate("jwt", { session: false }),requireAdmin,
  updateProductStatus
);

export default router;
