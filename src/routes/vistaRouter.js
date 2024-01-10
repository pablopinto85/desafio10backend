const express = require("express");
const { isUtf8 } = require("buffer");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
const handlebars = require('express-handlebars');
const {productModel} = require("../dao/mongo/models/products.model");
const {userModel} = require("../dao/mongo/models/users.model.js")
const { authToken } = require("../utils.js"); 
const passport = require("passport")


const router = express.Router()

router.get("/", async (req, res)=>{
    try{
        const contenidoJson = await fs.promises.readFile("products.json", "utf-8"); // revisar await en caso de error
        const productos = JSON.parse(contenidoJson);

        console.log("alo")
        res.render("home", {/* productos */})

    } catch{
        console.log("error al leer el archivo JSON:", error);
    }
});

router.get("/register", async (req, res)=>{
    try {
        res.render("register");
    } catch (error) {
        res.status(500).json({ message: "Error al cargar la página" });
    }
});


const PRODUCTS_PER_PAGE = 10; 


//allproducts con JWT
router.get("/allproducts", passport.authenticate("current", { session: false })/* authToken */, async (req, res) => {
    try {
        const nombre = req.user.nombre; // trae el nombre del usuario desde el DTO de la estrategia de passport
        console.log(nombre)

        const page = parseInt(req.query.page) || 1;

        // busca los productos en la bd
        const products = await productModel.find().limit(PRODUCTS_PER_PAGE).lean();
        
        // calcula los productos en la bd
        const totalProducts = await productModel.countDocuments();
        // calcular las páginas
        const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
        const prevPage = page - 1;
        const nextPage = page + 1;
        const prevLink = page > 1; // Verifica si hay un enlace "Anterior"
        const nextLink = page < totalPages;

        res.render("products", {
            productos: products,
            page,
            totalPages,
            nextPage,
            prevPage,
            prevLink,
            nextLink,
            nombre,
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
});


router.get("/login", async (req, res)=>{
    try{
        res.render("login",{})
    } catch (error){
        console.log("error al acceder a la vista:", error);
    }
});

router.get("/profile", async (req, res) => {
    try {
      const nombre = req.session.nombreUsuario;
      const apellido = req.session.apellidoUsuario;
      const email = req.session.emailUsuario;
      const rol = req.session.rolUsuario;
        res.render("profile", {
        nombre: nombre,
        apellido: apellido, 
        email: email,
        rol: rol
      });
    } catch (error) {
      console.log("Error al acceder a la vista de perfil:", error);
    }
  });



module.exports = router;

