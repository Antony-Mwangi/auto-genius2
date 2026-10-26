// models/Order.ts

import mongoose, { Schema, model, models, Document, Model } from "mongoose";

/**
 * Order document interface.
 * Matches the schema fields exactly so TypeScript can validate
 * queries and updates across the codebase.
 */
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | null;
  customerName: string;
  customerEmail: string;
  phone: string;
  paymentMethod: "M-Pesa" | "Cash on Delivery";
  itemsSummary: string;
  amount: number;
  total: number;
  status: "Pending" | "Processed" | "Dispatched" | "Delivered";

  // ===== Payment tracking =====
  paymentStatus: "unpaid" | "pending" | "paid" | "failed";
  /** Daraja CheckoutRequestID returned by the STK push request */
  checkoutRequestId: string | null;
  /** Kopo Kopo incoming payment request resource ID */
  kopokopoPaymentId: string | null;
  /** Kopo Kopo payment request resource URL used for reconciliation */
  kopokopoPaymentLocation: string | null;
  /** Hash of the checkout capability token returned once to the buyer */
  paymentAccessTokenHash: string | null;
  /** M-Pesa receipt number from the callback metadata */
  mpesaReceipt: string | null;
  /** Payer's phone number as reported by Safaricom */
  senderPhone: string | null;
  /** When the payment was confirmed */
  paymentDate: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["M-Pesa", "Cash on Delivery"],
    },
    itemsSummary: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Dispatched", "Delivered"],
      default: "Pending",
      index: true,
    },

    // ===== Payment tracking =====
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
      index: true,
    },
    checkoutRequestId: {
      type: String,
      default: null,
      index: true,
    },
    kopokopoPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    kopokopoPaymentLocation: {
      type: String,
      default: null,
    },
    paymentAccessTokenHash: {
      type: String,
      default: null,
      select: false,
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
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

// Compound index: quickly find pending M-Pesa orders awaiting callback
OrderSchema.index({ paymentStatus: 1, paymentMethod: 1 });

// Prevent Mongoose from caching an outdated model across hot reloads.
// In development, `models.Order` may hold a stale schema after edits.
const Order: Model<IOrder> =
  (models.Order as Model<IOrder>) || model<IOrder>("Order", OrderSchema);

export default Order;