// import mongoose, { Schema, model, models } from "mongoose";

// const ProductSchema = new Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true, trim: true },
//     imageUrl: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// // Gracefully handles Next.js compilation re-imports without recreating the model
// export default models.Product || model("Product", ProductSchema);




import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    category: { 
      type: String, 
      required: true, 
      trim: true 
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    // Optional: Store Cloudinary metadata for better management
    cloudinaryPublicId: { 
      type: String, 
      required: false 
    },
    cloudinaryAssetInfo: {
      type: {
        width: Number,
        height: Number,
        format: String,
        bytes: Number,
      },
      required: false,
    },
    // Optional: Store multiple image variants
    images: {
      type: [{
        url: String,
        publicId: String,
        width: Number,
        height: Number,
      }],
      default: [],
    },
  },
  { 
    timestamps: true 
  }
);

// Add index for better query performance
ProductSchema.index({ name: 1, category: 1 });

// Gracefully handles Next.js compilation re-imports without recreating the model
export default models.Product || model("Product", ProductSchema);