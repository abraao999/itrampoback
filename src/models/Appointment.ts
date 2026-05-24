import { Schema, model, models } from "mongoose";

export type AppointmentStatus = "pending" | "quoted" | "accepted" | "declined" | "completed";

export type AppointmentDocument = {
  service: string;
  company: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  time: string;
  quotePrice?: number;
  proposedDate?: string;
  proposedTime?: string;
  quoteMessage?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
};

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    service: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    providerId: {
      type: String,
      required: true,
      trim: true
    },
    providerName: {
      type: String,
      required: true,
      trim: true
    },
    providerPhone: {
      type: String,
      required: true,
      trim: true
    },
    customerName: {
      type: String,
      trim: true
    },
    customerPhone: {
      type: String,
      trim: true
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    quotePrice: {
      type: Number,
      min: 0
    },
    proposedDate: {
      type: String
    },
    proposedTime: {
      type: String
    },
    quoteMessage: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "quoted", "accepted", "declined", "completed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

export const Appointment =
  models.Appointment || model<AppointmentDocument>("Appointment", appointmentSchema);
