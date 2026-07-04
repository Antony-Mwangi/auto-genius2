// import mongoose, { Schema, model, models } from "mongoose";

// const OrderSchema = new Schema(
//   {
//     // ADDED: Link to tie the order document explicitly to a personalized user profile instance
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null, // Supports "Shop as a Guest" configurations safely
//     },
//     customerName: { type: String, required: true },
//     phone: { type: String, required: true },
//     paymentMethod: { type: String, required: true },
//     itemsSummary: { type: String, required: true },
//     total: { type: Number, required: true },
//     status: { type: String, default: "Pending" },
//   },
//   { timestamps: true }
// );

// export default models.Order || model("Order", OrderSchema);



import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    // Link to tie the order document explicitly to a personalized user profile instance
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Safely supports "Shop as a Guest" configurations when null
    },
    customerName: { 
      type: String, 
      required: true 
    },
    // ADDED: Crucial contact layer for guest invoice dispatches and transaction identification
    customerEmail: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true
    },
    phone: { 
      type: String, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      required: true 
    },
    itemsSummary: { 
      type: String, 
      required: true 
    },
    total: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      default: "Pending" 
    },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);