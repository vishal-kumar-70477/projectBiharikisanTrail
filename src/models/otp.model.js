const mongoose = require("mongoose")

otpSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
        userID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:[true,"user is required"]
        },
        otpHash:{
            type:String,
            required:[true,"otp hash is required"]
        }


},{
    timestamps:true
})

const otpModel = mongoose.model("otp",otpSchema);

module.exports = otpModel;