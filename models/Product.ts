


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

// // Human-readable availability display
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
//     return {
//       status: 'Available from International Supplier',
//       badgeColor: 'blue',
//       icon: '🌍',
//       message: `Can be ordered on request${this.supplierName ? ` from ${this.supplierName}` : ''}`,
//       supplierName: this.supplierName,
//       deliveryEstimate: this.supplierDeliveryTime || '10-21 business days',
//       shippingCost: this.supplierShippingCost || 0
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
      required: true 
    },
    
    // ============ INVENTORY MANAGEMENT FIELDS ============
    quantity: {
      type: Number,
      required: true,
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
    // ================================================
    
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
    // =====================================================
    
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============ VIRTUAL PROPERTIES ============

// Derived availability status
ProductSchema.virtual('availabilityStatus').get(function() {
  if (this.quantity > 0) {
    return 'IN_STOCK';
  } else if (this.supplierAvailable) {
    return 'INTERNATIONAL_SUPPLIER';
  } else {
    return 'OUT_OF_STOCK';
  }
});

// Human-readable availability display with shipping options
ProductSchema.virtual('availabilityDisplay').get(function() {
  let status;
  
  if (this.quantity > 0) {
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
      quantity: this.quantity,
      deliveryEstimate: '1-3 business days',
      isLowStock: this.quantity <= (this.lowStockThreshold || 5),
      lowStockThreshold: this.lowStockThreshold || 5
    };
  } else if (status === 'INTERNATIONAL_SUPPLIER') {
    // Build shipping options array for display
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
  return this.quantity > 0 || this.supplierAvailable;
});

// Check if product is low stock
ProductSchema.virtual('isLowStock').get(function() {
  return this.quantity > 0 && this.quantity <= (this.lowStockThreshold || 5);
});

// ============ INDEXES ============

ProductSchema.index({ name: 1, category: 1 });
ProductSchema.index({ chassisNumber: 1 }, { sparse: true });
ProductSchema.index({ quantity: 1 });
ProductSchema.index({ supplierAvailable: 1 });
ProductSchema.index({ 
  chassisNumber: 'text', 
  name: 'text', 
  description: 'text' 
});

// ============ EXPORT ============

export default models.Product || model("Product", ProductSchema);