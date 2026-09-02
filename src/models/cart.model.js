const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"buyers",
        unique:true,
        
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
                required:true,
                
            },
            productImageUri:{
                type:String,
                required:true
            },
            productDesc:{
                type:String,
                required:true

            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:String,
                required:true
            }
        }
    ]

})

const cartModel = new mongoose.model("cart",cartSchema);

module.exports = cartModel