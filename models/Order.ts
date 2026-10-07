import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    itemsSummary: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
    },
    mpesaReceipt: {
      type: String,
      default: null,
    },
    senderPhone: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    kopoKopoReference: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);