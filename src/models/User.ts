import { Schema, model, models } from "mongoose";

export type UserRole = "customer" | "provider" | "admin";

export type UserDocument = {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer"
    }
  },
  {
    timestamps: true
  }
);

export const User = models.User || model<UserDocument>("User", userSchema);
