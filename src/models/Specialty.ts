import { Schema, model, models } from "mongoose";

export type SpecialtyDocument = {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const specialtySchema = new Schema<SpecialtyDocument>(
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
    icon: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Specialty =
  models.Specialty || model<SpecialtyDocument>("Specialty", specialtySchema);
