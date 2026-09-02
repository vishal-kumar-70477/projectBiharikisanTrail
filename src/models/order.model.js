const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    productDesc: {
        type: String,
        required: true
    },

    sellerName: {
        type: String,
        required: true
    },

    sellerAddress: {
        village: String,
        district: String,
        state: String
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    productImageUri: {
        type: String
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    priceAtOrder: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    orderStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
            "refunded"
        ],
        default: "pending"
    },

    paymentMethod: {
        type: String,
        enum: [
            "cod",
            "upi",
            "card",
            "netbanking"
        ],
        default: "cod"
    },

    deliveryAddress: {
        name: String,
        mobileNo: String,
        village: String,
        district: String,
        state: String
    }

}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;