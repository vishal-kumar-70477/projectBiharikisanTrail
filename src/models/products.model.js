const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"seller id is required"]

    },
    sellerName:{
        type:String,
        required:[true,"Seller name is required"]
    },
    productImageUri:{
        type:String,
        required:[true,"Product Image Uri is required"]
    },
    productImageId:{
        type:String
    },
    productDesc:{
        type:String,
        required:[true,"description is required"]
    },
    productQuantity:{
        type:Number,
        required:[true,"Product quantity is required"]
    },
    productPrice:{
        type:Number,
        required:[true,"Product price is required"]
    },
    orderCount:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"

    }
},{
    timestamps:true
})

const productModel = new mongoose.model("products",productSchema);


module.exports = productModel;