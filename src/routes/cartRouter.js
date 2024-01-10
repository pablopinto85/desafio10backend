const express = require("express");
const router = express.Router();
const passport =  require("passport");
const { initializePassport, checkRole } = require("../config/passport.config.js");
const cartsControllers = require("../controllers/carts.controllers.js");

router.get("/api/carts/:cid", cartsControllers.getCartById); 
router.get("/api/carts", cartsControllers.getAllCarts); 
router.post("/api/carts", cartsControllers.createCart); 
router.post("/api/carts/:cid/products", passport.authenticate('current', { session: false }), checkRole('user'), cartsControllers.addProductsToCart); 
router.put("/api/carts/:cid/products/:pid", cartsControllers.updateProductQuantity); 
router.delete("/api/deletecarts/:id", cartsControllers.deleteCartById); 
router.delete("/api/deleteproductcarts/:cid", cartsControllers.deleteAllProductsInCart); 
router.delete("/api/carts/:cid/product/:pid", cartsControllers.deleteProductFromCart); 
router.get("/api/carts/:cid/purchase", passport.authenticate('current', { session: false }), checkRole('user'), cartsControllers.purchaseProducts); // realizar la compra total de los productos del carrito
router.get("/api/carts/getusercart", cartsControllers.getUserCart); 

module.exports = router;