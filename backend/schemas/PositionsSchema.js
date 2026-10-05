const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    product: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    avg: { type: Number, required: true },
    price: { type: Number, required: true },
    net: { type: String },
    day: { type: String },
    isLoss: { type: Boolean, default: false },
});

module.exports = { PositionsSchema };