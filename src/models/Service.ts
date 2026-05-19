import { Schema, model, models } from "mongoose";

export type ServiceDocument = {
  name: string;
  slug: string;
  description?: string;
  basePrice?: number;
  createdAt: Date;
  updatedAt: Date;
};

const serviceSchema = new Schema<ServiceDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      trim: true
    },
    basePrice: {
      type: Number,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export const Service = models.Service || model<ServiceDocument>("Service", serviceSchema);
