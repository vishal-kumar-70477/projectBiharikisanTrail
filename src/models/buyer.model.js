const mongoose = require("mongoose")

const buyerSchema = new mongoose.Schema({
    fullName:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email is required"]
    },
    mobileNo:{
        type:Number,
        unique:true,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    role:{
        type:String,
        enum:["seller","buyer","driver"],
        default:"buyer"
    },
    password:{
          type:String,

    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    verified:{
        type:String,
        default:undefined
    },
    address2:{
        type:Object
    }
})

const buyerModel = new mongoose.model("buyer",buyerSchema);

console.log("Model name:",buyerModel.modelName);
console.log("Collection name:",buyerModel.collection.name);


module.exports = buyerModel;