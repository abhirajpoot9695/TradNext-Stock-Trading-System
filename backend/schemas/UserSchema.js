const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = { UserSchema };