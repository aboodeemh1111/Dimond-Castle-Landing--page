import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "editor"],
        default: "admin",
        required: true,
    },
}, { timestamps: true });
UserSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
