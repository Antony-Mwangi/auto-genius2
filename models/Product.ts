

// import mongoose, { Schema, model, models } from "mongoose";

// const ProductSchema = new Schema(
//   {
//     name: { 
//       type: String, 
//       required: true, 
//       trim: true 
//     },
//     price: { 
//       type: Number, 
//       required: true 
//     },
//     category: { 
//       type: String, 
//       required: true, 
//       trim: true 
//     },
//     // NEW: Chassis number - essential for customer searches
//     chassisNumber: { 
//       type: String, 
//       required: true, 
//       unique: true,
//       trim: true,
//       index: true // Creates index for faster searches
//     },
//     // NEW: Product description
//     description: { 
//       type: String, 
//       required: false,
//       default: "",
//       trim: true 
//     },
//     imageUrl: { 
//       type: String, 
//       required: true 
//     },
//     // Optional: Store Cloudinary metadata for better management
//     cloudinaryPublicId: { 
//       type: String, 
//       required: false 
//     },
//     cloudinaryAssetInfo: {
//       type: {
//         width: Number,
//         height: Number,
//         format: String,
//         bytes: Number,
//       },
//       required: false,
//     },
//     // Optional: Store multiple image variants
//     images: {
//       type: [{
//         url: String,
//         publicId: String,
//         width: Number,
//         height: Number,
//       }],
//       default: [],
//     },
//   },
//   { 
//     timestamps: true 
//   }
// );

// // Add indexes for better query performance
// ProductSchema.index({ name: 1, category: 1 });
// ProductSchema.index({ chassisNumber: 1 }); // Already indexed above, but keeping for clarity
// ProductSchema.index({ chassisNumber: 'text', name: 'text', description: 'text' }); // Text search index

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
    // Chassis number - now optional
    chassisNumber: { 
      type: String, 
      required: false,
      unique: true,
      sparse: true, // Allows multiple null values while maintaining uniqueness for non-null values
      trim: true,
      index: true // Creates index for faster searches
    },
    // Product description
    description: { 
      type: String, 
      required: false,
      default: "",
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

// Add indexes for better query performance
ProductSchema.index({ name: 1, category: 1 });
// Index for chassis number with sparse option (allows null values)
ProductSchema.index({ chassisNumber: 1 }, { sparse: true });
// Text search index for searching across multiple fields
ProductSchema.index({ 
  chassisNumber: 'text', 
  name: 'text', 
  description: 'text' 
});

// Gracefully handles Next.js compilation re-imports without recreating the model
export default models.Product || model("Product", ProductSchema);