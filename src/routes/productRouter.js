const express = require("express");
const router = express.Router();
const passport =  require("passport");
const { checkRole } = require("../config/passport.config.js");
const ProductController = require("../controllers/products.controller.js");


router.get("/products", ProductController.getProducts); 
router.get("/product/:pid", ProductController.getProductById); 
router.post("/api/products", passport.authenticate('current', { session: false }), checkRole('admin'), ProductController.saveProduct); 
router.put("/products/:id", passport.authenticate('current', { session: false }), checkRole('admin'), ProductController.updateProduct); 
router.delete("/products/:id", passport.authenticate('current', { session: false }), checkRole('admin'), ProductController.deleteProduct);

module.exports = router;