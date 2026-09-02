const productModel = require("../models/products.model")
const sellerModel = require("../models/buyer.model")
const { uploadFile, deleteFile } = require("../services/stroge.service")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const buyerModel = require("../models/buyer.model")
 
 
// upload products
async function uploadProducts(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(404).json({
            success:false,
            message:"Refresh Token not found"
        })
     }
 
     const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY)
 
     if(!decoded){
        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        })
     }
 
     if(decoded.role !== "seller"){
        return res.status(403).json({
            success:false,
            message:"You are not a seller"
        })
     }

     const user = await buyerModel.findById(decoded.id);
     if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
     }

     const sellerName = user.fullName;
 
     const productImage = req.file;
     const {productDesc, productQuantity, productPrice} = req.body
     const result = await uploadFile(productImage);
     const product = await productModel.create({
        sellerId:decoded.id,
        sellerName,
        productImageUri:result.url,
        productImageId:result.fileId,
        productDesc,
        productQuantity,
        productPrice
    })
 
    return res.status(200).json({
        success:true,
        message:"Product Uploaded Successfully"
    })
}
 
 
// view products
async function viewProducts(req,res){
    const refreshToken = req.cookies.refreshToken;
 
    if(!refreshToken){
        return res.status(409).json({
            success:false,
            message:"Refresh token not found"
        })
    }
 
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);
 
    if(!decoded){
        return res.status(409).json({
            success:true,
            message:"Invalid Refresh Token"
        })
    }
 
    if(decoded.role !== "seller"){
        return res.status(403).json({
            success:false,
            message:"You are not a seller"
        })
    }
 
    const products = await productModel.find({
        sellerId:decoded.id});
 
    if(!products){
        return res.status(404).json({
            success:false,
            message:"No Products Available"
        })
    }
    let data = [];
    for(let i = 0; i < products.length;i++){
        data[i] = {
            _id:products[i]._id,
            productImageUri:products[i].productImageUri,
            productDesc:products[i].productDesc,
            productQuantity:products[i].productQuantity,
            productPrice:products[i].productPrice
 
        }
    }
 
    return res.status(200).json({
        success:true,
        message:"Products fetched Successfully",
        data
 
    })
 
 
}
 
// count total products
async function countProducts(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
 
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }
 
        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET_KEY
        );
 
        if (decoded.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not a seller"
            });
        }
 
        const totalProducts = await productModel.countDocuments({
            sellerId: decoded.id
        });
 
        return res.status(200).json({
            success: true,
            totalProducts
        });
 
    } catch (error) {
        console.log(error);
 
        return res.status(500).json({
            success: false,
            message: "Failed to count products"
        });
    }
}
 
 
// delete Products
async function deleteProduct(req,res){
    const productId = req.params.id;
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(409).json({
            success:false,
            message:"Token not found"
        })
    }
 
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);
 
    if(!decoded){
        return res.status(409).json({
            success:false,
            message:"invalid token"
        })
    }
 
    if(decoded.role !== "seller"){
        return res.status(403).json({
            success:false,
            message:"You are not a seller"
 
        })
    }
 
    const product = await productModel.findById(productId);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
 
    if(product.sellerId != decoded.id){
        return res.status(403).json({
            success:false,
            message:"Invalid Owner"
        })
    }
 
    if(product.productImageId){
        await deleteFile(product.productImageId);
    }
 
    await productModel.findByIdAndDelete(productId);
    return res.status(200).json({
        success:true,
        message:"Product deleted Successfully"
    })
}
 
 
 
// edit product
async function editProduct(req,res){
    const productId = req.params.id;
    if(!productId){
        return res.status(404).json({
            success:false,
            message:"Product id  not found"
        })
    }
 
    const refreshToken = req.cookies.refreshToken;
 
    if(!refreshToken){
        return res.status(404).json({
            success:false,
            message:"Refresh token not found"
        })
    }
 
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);
    if(!decoded){
        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        })
    }
 
    if(decoded.role !== "seller"){
        return res.status(401).json({
            success:false,
            message:"You are not a seller"
        })
    }
 
    const product = await productModel.findById(productId);
 
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
 
    if(product.sellerId.toString() !== decoded.id.toString()){
        return res.status(401).json({
            success:false,
            message:"Invalid Owner"
        })
    }
 
    const newProductImage = req.file;
    if(newProductImage){
        if(product.productImageId){
            await deleteFile(product.productImageId);
        }
        const result = await uploadFile(newProductImage);
        product.productImageUri = result.url;
        product.productImageId = result.fileId;
        await product.save()
    }
    const {productDesc, productPrice, productQuantity } = req.body;
 
    
    product.productDesc = productDesc;
    product.productQuantity = productQuantity
    product.productPrice = productPrice;
    await product.save();
 
    return res.status(200).json({
        success:true,
        message:"Product updated Successfully"
    })
}
 
module.exports = {  uploadProducts, viewProducts, countProducts,deleteProduct, editProduct};