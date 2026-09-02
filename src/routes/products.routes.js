const express = require("express");

const productController = require("../controllers/products.controller")
const multer = require("multer");

const upload = multer({
    storage:multer.memoryStorage()
});

const productsRouter = express.Router();

productsRouter.post("/upload-Products",upload.single("productImage"),productController.uploadProducts);
productsRouter.get("/view-Products",productController.viewProducts);
productsRouter.get("/count-Products",productController.countProducts);
productsRouter.delete("/delete-Products/:id",productController.deleteProduct);
productsRouter.patch("/edit-Products/:id",upload.single("productImage"),productController.editProduct);
module.exports = productsRouter