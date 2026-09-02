const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const path =require("path")
const productsRouter= require("./routes/products.routes")

const config = require("./config/config");
const buyerModel = require("./models/buyer.model");
const productModel = require("./models/products.model");

const buyerAuthRouter = require("./routes/buyerAuth.routes")
const buyerFeaturesRouter = require('./routes/buyerFeatures.routes')

const app = express();

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/biharikisan/auth",buyerAuthRouter);
// seller feature routes
app.use("/biharikisan/seller",productsRouter);
app.use("/biharikisan/buyer",buyerFeaturesRouter)

app.get("/dash/register", (req, res) => {
    res.render("login/register");
});

app.get("/", (req, res) => {
    res.render("dashboard/dash");
});

// farmer product upoload
app.get("/farmerProduct", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("farmer/farmerProduct", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/buyerDash", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("buyer/buyerDash", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/driverDash", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("driver/driverDash", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/farmerDash", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
            address: user.address.village + "," + user.address.state
        };

        res.render("farmer/farmerDash", { data});

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/allproduct", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
            address: user.address.village + "," + user.address.state
        };

        res.render("buyer/allProduct", { data});

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/viewproduct/:id", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        // Logged-in buyer
        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        // Product find
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Farmer / Seller find using sellerId
        const farmer = await buyerModel.findById(product.sellerId);

        if (!farmer) {
            return res.status(404).send("Farmer not found");
        }

        const data = {
            // Buyer data
            userName: user.fullName,
            address:
                user.address.village + ", " + user.address.state,

            // Farmer data
            farmerName: farmer.fullName,
            farmerAddress:
                farmer.address.village + ", " + farmer.address.state
        };

        res.render("buyer/viewsProduct", {
            data,
            productId: req.params.id
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/allproduct", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
            address: user.address.village + "," + user.address.state
        };

        res.render("buyer/allProduct", { data});

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

//review Summary
app.get("/orderSummery", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("buyer/orderSummary", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});


//cart
app.get("/cart", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("buyer/cart", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});


//payment
app.get("/orderconform", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("buyer/orderConform", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.get("/payment", (req, res) => {
    res.render("buyer/payment");
});

app.get("/buyer/myorder", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.redirect("/");
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        const user = await buyerModel.findById(decoded.id);

        if (!user) {
            return res.redirect("/");
        }

        const data = {
            userName: user.fullName,
             address: user.address.village + "," + user.address.state
        };

        res.render("buyer/myOrder", { data });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

module.exports = app;
