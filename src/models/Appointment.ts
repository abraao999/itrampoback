import { Schema, model, models } from "mongoose";

export type AppointmentStatus = "pending" | "accepted" | "declined" | "completed";

export type AppointmentDocument = {
  service: string;
  company: string;
  customerName?: string;
  customerPhone?: string;
  date: string;
  time: string;
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
    customerName: {
      type: String,
      trim: true
    },
    customerPhone: {
      type: String,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

export const Appointment =
  models.Appointment || model<AppointmentDocument>("Appointment", appointmentSchema);
