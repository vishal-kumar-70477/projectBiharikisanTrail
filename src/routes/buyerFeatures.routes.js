const express = require("express");
const buyerFeaturesController = require("../controllers/buyerFeatures.controller")


const buyerFeaturesRouter = express.Router();

buyerFeaturesRouter.get("/browse-Products",buyerFeaturesController.browseProducts);
buyerFeaturesRouter.post("/place-Order/:id",buyerFeaturesController.placeOrder);
buyerFeaturesRouter.get("/order-Page/:id",buyerFeaturesController.orderPage);
buyerFeaturesRouter.post("/add-To-Cart/:id",buyerFeaturesController.addToCart);
buyerFeaturesRouter.delete("/delete-From-Cart/:id",buyerFeaturesController.deleteFromCart)
buyerFeaturesRouter.get("/view-Cart",buyerFeaturesController.viewCart)
buyerFeaturesRouter.post("/edit-Address",buyerFeaturesController.editAddress)
buyerFeaturesRouter.post("/add-Address",buyerFeaturesController.addAddress)
buyerFeaturesRouter.get("/view-Orders",buyerFeaturesController.viewOrders);
buyerFeaturesRouter.get("/view-Addresses",  buyerFeaturesController.viewAddresses);

module.exports = buyerFeaturesRouter;