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
//     chassisNumber: { 
//       type: String, 
//       required: false,
//       unique: true,
//       sparse: true,
//       trim: true,
//       index: true
//     },
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
    
//     // ============ INVENTORY MANAGEMENT FIELDS ============
//     quantity: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0
//     },
//     supplierAvailable: {
//       type: Boolean,
//       default: false
//     },
//     supplierName: {
//       type: String,
//       required: false,
//       trim: true
//     },
//     supplierDeliveryTime: {
//       type: String,
//       required: false,
//       default: "10-21 business days"
//     },
//     supplierShippingCost: {
//       type: Number,
//       required: false,
//       default: 0,
//       min: 0
//     },
    
//     // ============ SHIPPING OPTIONS ============
//     shippingOptions: {
//       air: {
//         enabled: { 
//           type: Boolean, 
//           default: true 
//         },
//         deliveryTime: { 
//           type: String, 
//           default: "3-7 business days" 
//         },
//         cost: { 
//           type: Number, 
//           default: 0,
//           min: 0 
//         },
//         description: { 
//           type: String, 
//           default: "Express shipping by air freight" 
//         }
//       },
//       sea: {
//         enabled: { 
//           type: Boolean, 
//           default: true 
//         },
//         deliveryTime: { 
//           type: String, 
//           default: "20-35 business days" 
//         },
//         cost: { 
//           type: Number, 
//           default: 0,
//           min: 0 
//         },
//         description: { 
//           type: String, 
//           default: "Standard shipping by sea freight" 
//         }
//       }
//     },
//     // ================================================
    
//     restockDate: {
//       type: Date,
//       required: false
//     },
//     lowStockThreshold: {
//       type: Number,
//       required: false,
//       default: 5,
//       min: 0
//     },
//     // =====================================================
    
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
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// // ============ VIRTUAL PROPERTIES ============

// // Derived availability status
// ProductSchema.virtual('availabilityStatus').get(function() {
//   if (this.quantity > 0) {
//     return 'IN_STOCK';
//   } else if (this.supplierAvailable) {
//     return 'INTERNATIONAL_SUPPLIER';
//   } else {
//     return 'OUT_OF_STOCK';
//   }
// });

// // Human-readable availability display with shipping options
// ProductSchema.virtual('availabilityDisplay').get(function() {
//   let status;
  
//   if (this.quantity > 0) {
//     status = 'IN_STOCK';
//   } else if (this.supplierAvailable) {
//     status = 'INTERNATIONAL_SUPPLIER';
//   } else {
//     status = 'OUT_OF_STOCK';
//   }
  
//   if (status === 'IN_STOCK') {
//     return {
//       status: 'In Stock',
//       badgeColor: 'green',
//       icon: '✅',
//       message: `Available for immediate purchase`,
//       quantity: this.quantity,
//       deliveryEstimate: '1-3 business days',
//       isLowStock: this.quantity <= (this.lowStockThreshold || 5),
//       lowStockThreshold: this.lowStockThreshold || 5
//     };
//   } else if (status === 'INTERNATIONAL_SUPPLIER') {
//     // Build shipping options array for display
//     const shippingOptions = [];
    
//     if (this.shippingOptions?.air?.enabled !== false) {
//       shippingOptions.push({
//         method: 'air',
//         label: 'Air Freight (Express)',
//         deliveryTime: this.shippingOptions?.air?.deliveryTime || '3-7 business days',
//         cost: this.shippingOptions?.air?.cost || 0,
//         description: this.shippingOptions?.air?.description || 'Express shipping by air freight'
//       });
//     }
    
//     if (this.shippingOptions?.sea?.enabled !== false) {
//       shippingOptions.push({
//         method: 'sea',
//         label: 'Sea Freight (Standard)',
//         deliveryTime: this.shippingOptions?.sea?.deliveryTime || '20-35 business days',
//         cost: this.shippingOptions?.sea?.cost || 0,
//         description: this.shippingOptions?.sea?.description || 'Standard shipping by sea freight'
//       });
//     }

//     return {
//       status: 'Available from International Supplier',
//       badgeColor: 'blue',
//       icon: '🌍',
//       message: `Can be ordered on request${this.supplierName ? ` from ${this.supplierName}` : ''}`,
//       supplierName: this.supplierName,
//       deliveryEstimate: this.supplierDeliveryTime || '10-21 business days',
//       shippingCost: this.supplierShippingCost || 0,
//       shippingOptions: shippingOptions
//     };
//   } else {
//     return {
//       status: 'Out of Stock',
//       badgeColor: 'red',
//       icon: '❌',
//       message: 'Currently unavailable for purchase',
//       restockDate: this.restockDate,
//       restockMessage: this.restockDate ? `Expected restock: ${new Date(this.restockDate).toLocaleDateString()}` : 'Check back soon'
//     };
//   }
// });

// // Check if product can be purchased
// ProductSchema.virtual('isPurchasable').get(function() {
//   return this.quantity > 0 || this.supplierAvailable;
// });

// // Check if product is low stock
// ProductSchema.virtual('isLowStock').get(function() {
//   return this.quantity > 0 && this.quantity <= (this.lowStockThreshold || 5);
// });

// // ============ INDEXES ============

// ProductSchema.index({ name: 1, category: 1 });
// ProductSchema.index({ chassisNumber: 1 }, { sparse: true });
// ProductSchema.index({ quantity: 1 });
// ProductSchema.index({ supplierAvailable: 1 });
// ProductSchema.index({ 
//   chassisNumber: 'text', 
//   name: 'text', 
//   description: 'text' 
// });

// // ============ EXPORT ============

// export default models.Product || model("Product", ProductSchema);






import mongoose, { Schema, model, models } from "mongoose";

// ============ PRODUCT IMAGE SUB-SCHEMA ============
const ProductImageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: false
  },
  width: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: false
  },
  format: {
    type: String,
    required: false
  },
  bytes: {
    type: Number,
    required: false
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
}, { _id: true });

// ============ PRODUCT VARIANT SUB-SCHEMA ============
const ProductVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['piece', 'kg', 'g', 'lb', 'oz', 'm', 'cm', 'mm', 'liter', 'ml', 'each', 'pair', 'set', 'dozen', 'box', 'pack', 'custom'],
    default: 'piece'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    required: false,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  supplierAvailable: {
    type: Boolean,
    default: false
  },
  supplierName: {
    type: String,
    required: false,
    trim: true
  }
}, { _id: true });

// ============ MAIN PRODUCT SCHEMA ============
const ProductSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    price: { 
      type: Number, 
      required: false 
    },
    category: { 
      type: String, 
      required: true, 
      trim: true 
    },
    chassisNumber: { 
      type: String, 
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      index: true
    },
    description: { 
      type: String, 
      required: false,
      default: "",
      trim: true 
    },
    imageUrl: { 
      type: String, 
      required: false 
    },
    
    // ============ MULTIPLE IMAGES ============
    images: {
      type: [ProductImageSchema],
      default: []
    },

    // ============ VARIANTS WITH UNIT & PRICE ============
    variants: {
      type: [ProductVariantSchema],
      default: []
    },

    // ============ INVENTORY MANAGEMENT FIELDS ============
    quantity: {
      type: Number,
      required: false,
      default: 0,
      min: 0
    },
    supplierAvailable: {
      type: Boolean,
      default: false
    },
    supplierName: {
      type: String,
      required: false,
      trim: true
    },
    supplierDeliveryTime: {
      type: String,
      required: false,
      default: "10-21 business days"
    },
    supplierShippingCost: {
      type: Number,
      required: false,
      default: 0,
      min: 0
    },
    
    // ============ SHIPPING OPTIONS ============
    shippingOptions: {
      air: {
        enabled: { 
          type: Boolean, 
          default: true 
        },
        deliveryTime: { 
          type: String, 
          default: "3-7 business days" 
        },
        cost: { 
          type: Number, 
          default: 0,
          min: 0 
        },
        description: { 
          type: String, 
          default: "Express shipping by air freight" 
        }
      },
      sea: {
        enabled: { 
          type: Boolean, 
          default: true 
        },
        deliveryTime: { 
          type: String, 
          default: "20-35 business days" 
        },
        cost: { 
          type: Number, 
          default: 0,
          min: 0 
        },
        description: { 
          type: String, 
          default: "Standard shipping by sea freight" 
        }
      }
    },
    
    restockDate: {
      type: Date,
      required: false
    },
    lowStockThreshold: {
      type: Number,
      required: false,
      default: 5,
      min: 0
    },
    
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
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============ HELPER FUNCTION ============
// Calculate total inventory from variants or main quantity
function getTotalInventory(doc: any): number {
  if (doc.variants && doc.variants.length > 0) {
    return doc.variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0);
  }
  return doc.quantity || 0;
}

// ============ VIRTUAL PROPERTIES ============

// Get primary image
ProductSchema.virtual('primaryImage').get(function() {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find((img: any) => img.isPrimary);
    return primary || this.images[0];
  }
  return null;
});

// Get all image URLs
ProductSchema.virtual('imageUrls').get(function() {
  if (this.images && this.images.length > 0) {
    return this.images.map((img: any) => img.url);
  }
  return this.imageUrl ? [this.imageUrl] : [];
});

// Check if product has variants
ProductSchema.virtual('hasVariants').get(function() {
  return this.variants && this.variants.length > 0;
});

// Get default variant
ProductSchema.virtual('defaultVariant').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.find((v: any) => v.isDefault) || this.variants[0];
  }
  return null;
});

// Get display price (from default variant or base price)
ProductSchema.virtual('displayPrice').get(function() {
  if (this.variants && this.variants.length > 0) {
    const defaultVariant = this.variants.find((v: any) => v.isDefault) || this.variants[0];
    return defaultVariant ? defaultVariant.price : this.price;
  }
  return this.price;
});

// Get total inventory across all variants
ProductSchema.virtual('totalInventory').get(function() {
  return getTotalInventory(this);
});

// Derived availability status
ProductSchema.virtual('availabilityStatus').get(function() {
  const totalQty = getTotalInventory(this);
  
  if (totalQty > 0) {
    return 'IN_STOCK';
  } else if (this.supplierAvailable) {
    return 'INTERNATIONAL_SUPPLIER';
  } else {
    return 'OUT_OF_STOCK';
  }
});

// Human-readable availability display with shipping options
ProductSchema.virtual('availabilityDisplay').get(function() {
  const totalQty = getTotalInventory(this);
  let status;
  
  if (totalQty > 0) {
    status = 'IN_STOCK';
  } else if (this.supplierAvailable) {
    status = 'INTERNATIONAL_SUPPLIER';
  } else {
    status = 'OUT_OF_STOCK';
  }
  
  if (status === 'IN_STOCK') {
    return {
      status: 'In Stock',
      badgeColor: 'green',
      icon: '✅',
      message: `Available for immediate purchase`,
      quantity: totalQty,
      deliveryEstimate: '1-3 business days',
      isLowStock: totalQty <= (this.lowStockThreshold || 5),
      lowStockThreshold: this.lowStockThreshold || 5
    };
  } else if (status === 'INTERNATIONAL_SUPPLIER') {
    const shippingOptions = [];
    
    if (this.shippingOptions?.air?.enabled !== false) {
      shippingOptions.push({
        method: 'air',
        label: 'Air Freight (Express)',
        deliveryTime: this.shippingOptions?.air?.deliveryTime || '3-7 business days',
        cost: this.shippingOptions?.air?.cost || 0,
        description: this.shippingOptions?.air?.description || 'Express shipping by air freight'
      });
    }
    
    if (this.shippingOptions?.sea?.enabled !== false) {
      shippingOptions.push({
        method: 'sea',
        label: 'Sea Freight (Standard)',
        deliveryTime: this.shippingOptions?.sea?.deliveryTime || '20-35 business days',
        cost: this.shippingOptions?.sea?.cost || 0,
        description: this.shippingOptions?.sea?.description || 'Standard shipping by sea freight'
      });
    }

    return {
      status: 'Available from International Supplier',
      badgeColor: 'blue',
      icon: '🌍',
      message: `Can be ordered on request${this.supplierName ? ` from ${this.supplierName}` : ''}`,
      supplierName: this.supplierName,
      deliveryEstimate: this.supplierDeliveryTime || '10-21 business days',
      shippingCost: this.supplierShippingCost || 0,
      shippingOptions: shippingOptions
    };
  } else {
    return {
      status: 'Out of Stock',
      badgeColor: 'red',
      icon: '❌',
      message: 'Currently unavailable for purchase',
      restockDate: this.restockDate,
      restockMessage: this.restockDate ? `Expected restock: ${new Date(this.restockDate).toLocaleDateString()}` : 'Check back soon'
    };
  }
});

// Check if product can be purchased
ProductSchema.virtual('isPurchasable').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.some((v: any) => (v.quantity || 0) > 0 || v.supplierAvailable);
  }
  const totalQty = this.quantity || 0;
  return totalQty > 0 || this.supplierAvailable;
});

// Check if product is low stock
ProductSchema.virtual('isLowStock').get(function() {
  const totalQty = getTotalInventory(this);
  return totalQty > 0 && totalQty <= (this.lowStockThreshold || 5);
});

// Get variant options
ProductSchema.virtual('variantOptions').get(function() {
  if (!this.variants || this.variants.length === 0) return [];
  
  return this.variants.map((v: any) => ({
    id: v._id,
    name: v.name,
    unit: v.unit,
    price: v.price,
    quantity: v.quantity,
    isDefault: v.isDefault,
    sku: v.sku
  }));
});

// ============ INSTANCE METHODS ============

// Add variant
ProductSchema.methods.addVariant = function(variantData: any) {
  this.variants.push(variantData);
  return this;
};

// Remove variant
ProductSchema.methods.removeVariant = function(variantId: string) {
  const variant = this.variants.id(variantId);
  if (variant) {
    variant.remove();
  }
  return this;
};

// ============ INDEXES ============

ProductSchema.index({ name: 1, category: 1 });
ProductSchema.index({ chassisNumber: 1 }, { sparse: true });
ProductSchema.index({ quantity: 1 });
ProductSchema.index({ supplierAvailable: 1 });
ProductSchema.index({ 'variants.sku': 1 }, { sparse: true });
ProductSchema.index({ 
  chassisNumber: 'text', 
  name: 'text', 
  description: 'text' 
});

// ============ EXPORT ============

export default models.Product || model("Product", ProductSchema);