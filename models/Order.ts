import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    itemsSummary: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);