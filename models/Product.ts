import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

// Gracefully handles Next.js compilation re-imports without recreating the model
export default models.Product || model("Product", ProductSchema);