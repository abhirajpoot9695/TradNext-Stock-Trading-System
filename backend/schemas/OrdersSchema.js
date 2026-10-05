const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    product: { type: String, enum: ["CNC", "MIS"], default: "CNC" },
}, { timestamps: true });

module.exports = { OrdersSchema };