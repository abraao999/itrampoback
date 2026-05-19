import { Schema, model, models } from "mongoose";

export type ProviderStatus = "pending" | "active" | "blocked";

export type ProviderDocument = {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  companyName: string;
  specialtySlug: string;
  specialtyName: string;
  city?: string;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
};

const providerSchema = new Schema<ProviderDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    specialtySlug: { type: String, required: true, trim: true, lowercase: true },
    specialtyName: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Provider =
  models.Provider || model<ProviderDocument>("Provider", providerSchema);
