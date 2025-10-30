import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "editor";

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  comparePassword: (plain: string) => Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
