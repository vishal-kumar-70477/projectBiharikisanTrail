const productModel = require("../models/products.model");
const orderModel = require("../models/order.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const buyerModel = require("../models/buyer.model");
const cartModel = require("../models/cart.model");


// browse all products
async function browseProducts(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(404).json({
            success:false,
            message:"Token not found"
        })
    }

    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }

    const data = await productModel.find({
        status:"active"
    })

    if(!data){
        return res.status(404).json({
            success:false,
            message:"No Products Available"
        })
    }
    const products = [];

    for(let i=0; i < data.length; i++){
        products[i] = {
            productId:data[i]._id,
            sellerName:data[i].sellerName,
            productImageUri:data[i].productImageUri,
            productDesc:data[i].productDesc,
            productQuantity:data[i].productQuantity,
            productPrice:data[i].productPrice
        }
    }

    return res.status(200).json({
        success:true,
        message:"All Products Fetched Successfully",
        products
    })

}


// order Page
async function orderPage(req,res){
    const productId = req.params.id;
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(404).json({
            success:false,
            message:"Token not founbd"
        })
    }
    
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);
    
    if(!decoded){
        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        })
    }
    const product = await productModel.findById(productId);

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
   const sellerId = product.sellerId;
    
    if(!sellerId){
        return res.status(401).json({
            success:false,
            message:"Seller not found"
        })
    }
    const address = await buyerModel.find({
        _id:sellerId
    }).select("address")
    
    
    return res.status(200).json({
        productImageUri:product.productImageUri,
        productDesc:product.productDesc,
        sellerName:product.sellerName,
        availableQuantity:product.productQuantity,
        price:product.productPrice,
        sellerAddress: `${address[0].address.village}, ${address[0].address.state}`

        
    })
}



// place order
// place order
async function placeOrder(req, res) {
    const productId = req.params.id;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(404).json({
            success: false,
            message: "Token not founbd"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET_KEY);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        })
    }

    const product = await productModel.findById(productId);
    if (product.status == "inactive") {
        return res.status(401).json({
            success: false,
            message: "Out of Stock"
        })
    }

    const buyer = await buyerModel.findById(decoded.id);

    const { quantity, paymentMethod } = req.body;
    const buyerId = decoded.id;
    const sellerId = product.sellerId;
    const priceAtOrder = product.productPrice;
    const totalAmount = quantity * priceAtOrder;
    const productDesc = product.productDesc;
    const sellerName = product.sellerName;

    // seller ka address fetch karke snapshot save karenge (populate ki zaroorat nahi padegi)
    const seller = await buyerModel.findById(sellerId).select("address");

    const sellerAddress = {
        village: seller?.address?.village || "",
        district: seller?.address?.district || "",
        state: seller?.address?.state || ""
    };

    const deliveryAddress = {
        name: buyer.fullName,
        mobileNo: buyer.mobileNo,
        state: buyer.address.state,
        village: buyer.address.village,
        district: buyer.address.district,
    }

    if (quantity > product.productQuantity) {
        return res.status(409).json({
            success: false,
            message: "Please enter quantity less than available quantity"
        })
    }
    const productImageUri = product.productImageUri;

    const order = await orderModel.create({
        buyerId,
        sellerId,
        productId,
        sellerName,
        productDesc,
        sellerAddress,
        productImageUri,
        quantity,
        priceAtOrder,
        totalAmount,
        deliveryAddress,
        paymentMethod
    });
    order.orderStatus = "confirmed";
    await order.save();
    const remainingQuantity = product.productQuantity - quantity;
    product.productQuantity = remainingQuantity;
    await product.save();
    product.orderCount = product.orderCount + 1;
    await product.save();

    return res.status(200).json({
        success: true,
        message: "Order Placed Successfully"
    })
}

// add to cart
async function addToCart(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const productId = req.params.id;
        const { quantity } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(401).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            });
        }

        if (quantity > product.productQuantity) {
            return res.status(403).json({
                success: false,
                message: "Please enter less than available quantity"
            });
        }

        // Find buyer's cart
        let cart = await cartModel.findOne({
            buyerId: decoded.id
        });

        // If cart doesn't exist, create new cart
        if (!cart) {
            cart = await cartModel.create({
                buyerId: decoded.id,
                items: [
                    {
                        productId: product._id,
                        productImageUri: product.productImageUri,
                        productDesc: product.productDesc,
                        quantity: quantity,
                        price: product.productPrice
                    }
                ]
            });

            return res.status(200).json({
                success: true,
                message: "Item added successfully",
                items: cart.items,
                cartCount: cart.items.length
            });
        }

        // Check whether product already exists
        const alreadyAdded = cart.items.some(
            item =>
                item.productId.toString() === productId.toString()
        );

        if (alreadyAdded) {
            return res.status(409).json({
                success: false,
                message: "Already Added In Cart",
                items: cart.items,
                cartCount: cart.items.length
            });
        }

        // Add new product
        cart.items.push({
            productId: product._id,
            productImageUri: product.productImageUri,
            productDesc: product.productDesc,
            quantity: quantity,
            price: product.productPrice
        });

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item added successfully",
            items: cart.items,
            cartCount: cart.items.length
        });

    } catch (error) {
        console.error("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message
        });
    }
}
// delete from cart
async function deleteFromCart(req,res){
    const refreshToken = req.cookies.refreshToken;
    const productId = req.params.id;
    
    if(!refreshToken){
        return res.status(404).json({
            success:false,
            message:"token not found"
     })
    }
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY)
    
    if(decoded.role !== "buyer"){
        return res.status(401).json({
            success:false,
            message:"You are not a buyer"
        })
    }

    

    

   



    const cart = await cartModel.findOne({
        buyerId:decoded.id
    })
    const items = cart.items;
    const index = items.indexOf(productId);
    items.splice(index,1);
    cart.items = items;
    await cart.save();

    return res.status(200).json({
        success:true,
        message:"Product Removed From Cart"
    })

    
}

// view cart
async function viewCart(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );

        if (decoded.role !== "buyer") {
            return res.status(401).json({
                success: false,
                message: "You are not a buyer"
            });
        }

        const cart = await cartModel.findOne({
            buyerId: decoded.id
        });

        // No cart = empty cart
        if (!cart) {
            return res.status(200).json({
                success: true,
                items: [],
                cartCount: 0
            });
        }

        return res.status(200).json({
            success: true,
            items: cart.items || [],
            cartCount: cart.items ? cart.items.length : 0
        });

    } catch (error) {
        console.error("VIEW CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load cart",
            error: error.message
        });
    }
}
//edit address
async function editAddress(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(401).json({
            success:false,
            message:"invalid token"
        })
    }

    if(decoded.role !== "buyer"){
        return res.status(403).json({
            success:false,
            message:"You are not a buyer"
        })
    }

    const buyer = await buyerModel.findById(decoded.id);

    if(!buyer){
        return res.status(404).json({
            success:false,
            message:"Buyer not found"
        })
    }
    const {village, district, state, pincode} = req.body;
    const newAddress = {
        "village":village,
        "district":district,
        "state":state,
        "pincode":pincode
    }
    buyer.address = newAddress;
    await buyer.save();

    return res.status(200).json({
        success:true,
        message:"Address Updated Successfully"
    })

}

// add new address
async function addAddress(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(401).json({
            success:false,
            message:"invalid token"
        })
    }

    if(decoded.role !== "buyer"){
        return res.status(403).json({
            success:false,
            message:"You are not a buyer"
        })
    }
    const buyer = await buyerModel.findById(decoded.id);
    if(!buyer){
        return res.status(404).json({
            success:false,
            message:"Buyer Not Found"
        })
    }

    if(buyer.address && buyer.address2){
        return res.status(403).json({
            success:false,
            message:"Already two addresses added"
        })
    }

    const {village,district,state,pincode} = req.body;
    const address = {
        village,
        district,
        state,
        pincode
    } 

    buyer.address2 = address;
    await buyer.save()
    return res.status(201).json({
        success:true,
        message:"Address added successfully"
    })
}

// view my orders
async function viewOrders(req,res){
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:"Refresh token not found"
            })
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET_KEY);

        if(decoded.role !== "buyer"){
            return res.status(403).json({
                success:false,
                message:"You are not a buyer"
            });
        }

        const orders = await orderModel.find({
            buyerId: decoded.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success:true,
            message:"My orders fetched",
            orders
        });
    } catch (error) {
        console.error("viewOrders failed:", error);

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                success:false,
                message:"Invalid or expired session"
            });
        }

        return res.status(500).json({
            success:false,
            message:"Unable to fetch orders"
        });
    }

}
// ============================================================
// VIEW ADDRESSES
// ============================================================

async function viewAddresses(req, res) {

    try {

        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {

            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });

        }


        const decoded =
            jwt.verify(
                refreshToken,
                config.JWT_SECRET_KEY
            );


        if (decoded.role !== "buyer") {

            return res.status(403).json({
                success: false,
                message: "You are not a buyer"
            });

        }


        const buyer =
            await buyerModel.findById(decoded.id)
                .select("fullName mobileNo address address2");


        if (!buyer) {

            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });

        }


        return res.status(200).json({

            success: true,

            addresses: {

                address: buyer.address || null,

                address2: buyer.address2 || null

            }

        });

    } catch (error) {

        console.error(
            "VIEW ADDRESSES ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch addresses",

            error: error.message

        });

    }
}

module.exports = {browseProducts,placeOrder,orderPage,addToCart,deleteFromCart,viewCart,editAddress,addAddress,viewOrders,viewAddresses};