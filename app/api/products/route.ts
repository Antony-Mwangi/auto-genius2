

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Product from "@/models/Product";
// import cloudinary from "@/lib/cloudinary";

// // 1. GET: Fetch all products or search by chassis number
// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const chassisNumber = searchParams.get("chassisNumber");
//     const searchTerm = searchParams.get("search");
//     const availability = searchParams.get("availability");
    
//     let query: any = {};
    
//     // Search by exact chassis number
//     if (chassisNumber) {
//       const product = await Product.findOne({ chassisNumber });
//       if (!product) {
//         return NextResponse.json(
//           { message: "Product not found with this chassis number." },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(product, { status: 200 });
//     }
    
//     // Search by text (chassis number, name, or description)
//     if (searchTerm) {
//       query.$or = [
//         { chassisNumber: { $regex: searchTerm, $options: 'i' } },
//         { name: { $regex: searchTerm, $options: 'i' } },
//         { description: { $regex: searchTerm, $options: 'i' } }
//       ];
//     }
    
//     // Filter by availability status
//     if (availability) {
//       if (availability === 'IN_STOCK') {
//         query.quantity = { $gt: 0 };
//       } else if (availability === 'INTERNATIONAL_SUPPLIER') {
//         query.quantity = { $lte: 0 };
//         query.supplierAvailable = true;
//       } else if (availability === 'OUT_OF_STOCK') {
//         query.quantity = { $lte: 0 };
//         query.supplierAvailable = false;
//       }
//     }
    
//     // Return products based on query
//     const products = await Product.find(query).sort({ createdAt: -1 });
//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch store inventory records." },
//       { status: 500 }
//     );
//   }
// }

// // 2. POST: Create a new product
// export async function POST(request: Request) {
//   try {
//     await connectDB();
//     const formData = await request.formData();
//     const name = formData.get("name") as string;
//     const price = formData.get("price") as string;
//     const category = formData.get("category") as string;
//     const chassisNumber = formData.get("chassisNumber") as string;
//     const description = formData.get("description") as string;
//     const file = formData.get("image") as File | null;
    
//     // Inventory fields
//     const quantity = parseInt(formData.get("quantity") as string) || 0;
//     const supplierAvailable = formData.get("supplierAvailable") === "true";
//     const supplierName = formData.get("supplierName") as string || "";
//     const supplierDeliveryTime = formData.get("supplierDeliveryTime") as string || "10-21 business days";
//     const supplierShippingCost = parseFloat(formData.get("supplierShippingCost") as string) || 0;
//     const restockDate = formData.get("restockDate") as string || null;
//     const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string) || 5;
    
//     // Shipping Options - Air
//     const airEnabled = formData.get("shippingOptions[air][enabled]") === "true";
//     const airDeliveryTime = formData.get("shippingOptions[air][deliveryTime]") as string || "3-7 business days";
//     const airCost = parseFloat(formData.get("shippingOptions[air][cost]") as string) || 0;
//     const airDescription = formData.get("shippingOptions[air][description]") as string || "Express shipping by air freight";
    
//     // Shipping Options - Sea
//     const seaEnabled = formData.get("shippingOptions[sea][enabled]") === "true";
//     const seaDeliveryTime = formData.get("shippingOptions[sea][deliveryTime]") as string || "20-35 business days";
//     const seaCost = parseFloat(formData.get("shippingOptions[sea][cost]") as string) || 0;
//     const seaDescription = formData.get("shippingOptions[sea][description]") as string || "Standard shipping by sea freight";

//     // Validate required fields
//     if (!name || !price || !category || !file) {
//       return NextResponse.json(
//         { message: "Missing required fields. Name, price, category, and image are required." },
//         { status: 400 }
//       );
//     }

//     // Check if chassis number already exists (only if provided)
//     if (chassisNumber && chassisNumber.trim()) {
//       const existingProduct = await Product.findOne({ chassisNumber: chassisNumber.trim() });
//       if (existingProduct) {
//         return NextResponse.json(
//           { message: "A product with this chassis number already exists." },
//           { status: 400 }
//         );
//       }
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Upload to Cloudinary
//     const uploadResponse = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: "products",
//           public_id: `${Date.now()}-${file.name.replace(/\s+/g, "-").split(".")[0]}`,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       uploadStream.end(buffer);
//     });

//     const uploadedFile = uploadResponse as any;
//     const imageUrl = uploadedFile.secure_url;
//     const cloudinaryPublicId = uploadedFile.public_id;

//     // Create product with all fields including inventory and shipping options
//     const newProduct = await Product.create({
//       name,
//       price: parseFloat(price),
//       category,
//       chassisNumber: chassisNumber && chassisNumber.trim() ? chassisNumber.trim() : null,
//       description: description || "",
//       imageUrl,
//       cloudinaryPublicId,
//       cloudinaryAssetInfo: {
//         width: uploadedFile.width,
//         height: uploadedFile.height,
//         format: uploadedFile.format,
//         bytes: uploadedFile.bytes,
//       },
//       // Inventory fields
//       quantity,
//       supplierAvailable,
//       supplierName: supplierAvailable ? supplierName : "",
//       supplierDeliveryTime: supplierAvailable ? supplierDeliveryTime : "10-21 business days",
//       supplierShippingCost: supplierAvailable ? supplierShippingCost : 0,
//       restockDate: (!quantity && !supplierAvailable && restockDate) ? new Date(restockDate) : null,
//       lowStockThreshold,
//       // Shipping Options
//       shippingOptions: supplierAvailable ? {
//         air: {
//           enabled: airEnabled,
//           deliveryTime: airDeliveryTime,
//           cost: airCost,
//           description: airDescription
//         },
//         sea: {
//           enabled: seaEnabled,
//           deliveryTime: seaDeliveryTime,
//           cost: seaCost,
//           description: seaDescription
//         }
//       } : undefined
//     });

//     return NextResponse.json(
//       { message: "Product created successfully.", product: newProduct },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Product creation error:", error);
//     return NextResponse.json(
//       { message: error.message || "Internal server data processing crash." },
//       { status: 500 }
//     );
//   }
// }

// // 3. PUT: Update an existing product
// export async function PUT(request: Request) {
//   try {
//     await connectDB();
//     const formData = await request.formData();
//     const id = formData.get("id") as string;
//     const name = formData.get("name") as string;
//     const price = formData.get("price") as string;
//     const category = formData.get("category") as string;
//     const chassisNumber = formData.get("chassisNumber") as string;
//     const description = formData.get("description") as string;
//     const file = formData.get("image") as File | null;
    
//     // Inventory fields
//     const quantity = parseInt(formData.get("quantity") as string) || 0;
//     const supplierAvailable = formData.get("supplierAvailable") === "true";
//     const supplierName = formData.get("supplierName") as string || "";
//     const supplierDeliveryTime = formData.get("supplierDeliveryTime") as string || "10-21 business days";
//     const supplierShippingCost = parseFloat(formData.get("supplierShippingCost") as string) || 0;
//     const restockDate = formData.get("restockDate") as string || null;
//     const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string) || 5;
    
//     // Shipping Options - Air
//     const airEnabled = formData.get("shippingOptions[air][enabled]") === "true";
//     const airDeliveryTime = formData.get("shippingOptions[air][deliveryTime") as string || "3-7 business days";
//     const airCost = parseFloat(formData.get("shippingOptions[air][cost]") as string) || 0;
//     const airDescription = formData.get("shippingOptions[air][description]") as string || "Express shipping by air freight";
    
//     // Shipping Options - Sea
//     const seaEnabled = formData.get("shippingOptions[sea][enabled]") === "true";
//     const seaDeliveryTime = formData.get("shippingOptions[sea][deliveryTime]") as string || "20-35 business days";
//     const seaCost = parseFloat(formData.get("shippingOptions[sea][cost]") as string) || 0;
//     const seaDescription = formData.get("shippingOptions[sea][description]") as string || "Standard shipping by sea freight";

//     // Validate required fields
//     if (!id || !name || !price || !category) {
//       return NextResponse.json(
//         { message: "Missing required details to update item." },
//         { status: 400 }
//       );
//     }

//     const currentProduct = await Product.findById(id);
//     if (!currentProduct) {
//       return NextResponse.json(
//         { message: "Product not found in index." },
//         { status: 404 }
//       );
//     }

//     // Check if chassis number is being changed and if it already exists
//     const trimmedChassis = chassisNumber && chassisNumber.trim() ? chassisNumber.trim() : null;
//     if (trimmedChassis !== currentProduct.chassisNumber) {
//       // Only check uniqueness if a chassis number is provided
//       if (trimmedChassis) {
//         const existingProduct = await Product.findOne({ 
//           chassisNumber: trimmedChassis, 
//           _id: { $ne: id } 
//         });
//         if (existingProduct) {
//           return NextResponse.json(
//             { message: "Another product with this chassis number already exists." },
//             { status: 400 }
//           );
//         }
//       }
//     }

//     let imageUrl = currentProduct.imageUrl;
//     let cloudinaryPublicId = currentProduct.cloudinaryPublicId;
//     let cloudinaryAssetInfo = currentProduct.cloudinaryAssetInfo;

//     // If a new image file is supplied, upload to Cloudinary
//     if (file && file.size > 0) {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       // Delete old image from Cloudinary if exists
//       if (currentProduct.cloudinaryPublicId) {
//         try {
//           await cloudinary.uploader.destroy(currentProduct.cloudinaryPublicId);
//         } catch (cloudinaryErr) {
//           console.warn("Cloudinary image deletion warning:", cloudinaryErr);
//         }
//       }

//       // Upload new image to Cloudinary
//       const uploadResponse = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "products",
//             public_id: `${Date.now()}-${file.name.replace(/\s+/g, "-").split(".")[0]}`,
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         uploadStream.end(buffer);
//       });

//       const uploadedFile = uploadResponse as any;
//       imageUrl = uploadedFile.secure_url;
//       cloudinaryPublicId = uploadedFile.public_id;
//       cloudinaryAssetInfo = {
//         width: uploadedFile.width,
//         height: uploadedFile.height,
//         format: uploadedFile.format,
//         bytes: uploadedFile.bytes,
//       };
//     }

//     // Update all fields including inventory and shipping options
//     currentProduct.name = name;
//     currentProduct.price = parseFloat(price);
//     currentProduct.category = category;
//     currentProduct.chassisNumber = trimmedChassis;
//     currentProduct.description = description || currentProduct.description || "";
//     currentProduct.imageUrl = imageUrl;
//     currentProduct.cloudinaryPublicId = cloudinaryPublicId;
//     currentProduct.cloudinaryAssetInfo = cloudinaryAssetInfo;
    
//     // Update inventory fields
//     currentProduct.quantity = quantity;
//     currentProduct.supplierAvailable = supplierAvailable;
//     currentProduct.supplierName = supplierAvailable ? supplierName : "";
//     currentProduct.supplierDeliveryTime = supplierAvailable ? supplierDeliveryTime : "10-21 business days";
//     currentProduct.supplierShippingCost = supplierAvailable ? supplierShippingCost : 0;
//     currentProduct.restockDate = (!quantity && !supplierAvailable && restockDate) ? new Date(restockDate) : null;
//     currentProduct.lowStockThreshold = lowStockThreshold;
    
//     // Update shipping options
//     if (supplierAvailable) {
//       currentProduct.shippingOptions = {
//         air: {
//           enabled: airEnabled,
//           deliveryTime: airDeliveryTime,
//           cost: airCost,
//           description: airDescription
//         },
//         sea: {
//           enabled: seaEnabled,
//           deliveryTime: seaDeliveryTime,
//           cost: seaCost,
//           description: seaDescription
//         }
//       };
//     } else {
//       currentProduct.shippingOptions = undefined;
//     }
    
//     await currentProduct.save();

//     return NextResponse.json(
//       { message: "Product updated successfully.", product: currentProduct },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Product update error:", error);
//     return NextResponse.json(
//       { message: error.message || "Failed to update product payload data." },
//       { status: 500 }
//     );
//   }
// }

// // 4. DELETE: Purge product item records
// export async function DELETE(request: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { message: "Missing targeting product ID parameter." },
//         { status: 400 }
//       );
//     }

//     const productToDelete = await Product.findById(id);
//     if (!productToDelete) {
//       return NextResponse.json(
//         { message: "Target document could not be found." },
//         { status: 404 }
//       );
//     }

//     // Delete image from Cloudinary using stored public ID
//     try {
//       if (productToDelete.cloudinaryPublicId) {
//         await cloudinary.uploader.destroy(productToDelete.cloudinaryPublicId);
//       }
//     } catch (cloudinaryErr) {
//       console.warn("Cloudinary image deletion warning:", cloudinaryErr);
//     }

//     await Product.findByIdAndDelete(id);
//     return NextResponse.json(
//       { message: "Product item permanently dropped from system matrix." },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Product deletion error:", error);
//     return NextResponse.json(
//       { message: error.message || "Failed to handle record deletion." },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// 1. GET: Fetch all products or search with filters
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const chassisNumber = searchParams.get("chassisNumber");
    const searchTerm = searchParams.get("search");
    const availability = searchParams.get("availability");
    const status = searchParams.get("status");
    
    let query: any = {};
    
    if (chassisNumber) {
      const product = await Product.findOne({ chassisNumber });
      if (!product) {
        return NextResponse.json(
          { message: "Product not found with this chassis number." },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    }
    
    if (searchTerm) {
      query.$or = [
        { chassisNumber: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    if (availability) {
      if (availability === 'IN_STOCK') {
        query.$or = [
          { quantity: { $gt: 0 } },
          { 'variants.quantity': { $gt: 0 } }
        ];
      } else if (availability === 'INTERNATIONAL_SUPPLIER') {
        query.$or = [
          { 
            quantity: { $lte: 0 }, 
            supplierAvailable: true 
          },
          { 
            'variants.quantity': { $lte: 0 }, 
            'variants.supplierAvailable': true 
          }
        ];
      } else if (availability === 'OUT_OF_STOCK') {
        query.$and = [
          { 
            $or: [
              { quantity: { $lte: 0 } },
              { quantity: { $exists: false } }
            ]
          },
          { supplierAvailable: false },
          { 
            $or: [
              { 'variants.quantity': { $lte: 0 } },
              { 'variants.quantity': { $exists: false } }
            ]
          },
          { 'variants.supplierAvailable': false }
        ];
      }
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch store inventory records." },
      { status: 500 }
    );
  }
}

// 2. POST: Create a new product
export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const chassisNumber = formData.get("chassisNumber") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File | null;
    
    // Multiple images support
    const imageFiles = formData.getAll("images") as File[];
    
    // Variants with units and prices
    const variantNames = formData.getAll("variants[name]") as string[];
    const variantUnits = formData.getAll("variants[unit]") as string[];
    const variantPrices = formData.getAll("variants[price]") as string[];
    const variantQuantities = formData.getAll("variants[quantity]") as string[];
    const variantSkus = formData.getAll("variants[sku]") as string[];
    const variantIsDefault = formData.getAll("variants[isDefault]") as string[];
    
    // Inventory fields
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const supplierAvailable = formData.get("supplierAvailable") === "true";
    const supplierName = formData.get("supplierName") as string || "";
    const supplierDeliveryTime = formData.get("supplierDeliveryTime") as string || "10-21 business days";
    const supplierShippingCost = parseFloat(formData.get("supplierShippingCost") as string) || 0;
    const restockDate = formData.get("restockDate") as string || null;
    const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string) || 5;
    
    // Shipping Options - Air
    const airEnabled = formData.get("shippingOptions[air][enabled]") === "true";
    const airDeliveryTime = formData.get("shippingOptions[air][deliveryTime]") as string || "3-7 business days";
    const airCost = parseFloat(formData.get("shippingOptions[air][cost]") as string) || 0;
    const airDescription = formData.get("shippingOptions[air][description]") as string || "Express shipping by air freight";
    
    // Shipping Options - Sea
    const seaEnabled = formData.get("shippingOptions[sea][enabled]") === "true";
    const seaDeliveryTime = formData.get("shippingOptions[sea][deliveryTime]") as string || "20-35 business days";
    const seaCost = parseFloat(formData.get("shippingOptions[sea][cost]") as string) || 0;
    const seaDescription = formData.get("shippingOptions[sea][description]") as string || "Standard shipping by sea freight";

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { message: "Missing required fields. Name, category are required." },
        { status: 400 }
      );
    }

    // Check if chassis number already exists
    if (chassisNumber && chassisNumber.trim()) {
      const existingProduct = await Product.findOne({ chassisNumber: chassisNumber.trim() });
      if (existingProduct) {
        return NextResponse.json(
          { message: "A product with this chassis number already exists." },
          { status: 400 }
        );
      }
    }

    let imageUrl = "";
    let cloudinaryPublicId = "";
    let cloudinaryAssetInfo: any = null;
    
    // Define the type for uploaded images
    interface UploadedImage {
      url: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
      isPrimary: boolean;
    }
    
    const uploadedImages: UploadedImage[] = [];

    // Handle single image upload (legacy)
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            public_id: `${Date.now()}-${file.name.replace(/\s+/g, "-").split(".")[0]}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      const uploadedFile = uploadResponse as any;
      imageUrl = uploadedFile.secure_url;
      cloudinaryPublicId = uploadedFile.public_id;
      cloudinaryAssetInfo = {
        width: uploadedFile.width,
        height: uploadedFile.height,
        format: uploadedFile.format,
        bytes: uploadedFile.bytes,
      };
    }

    // Handle multiple images upload
    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const imgFile = imageFiles[i];
        if (imgFile.size > 0) {
          const bytes = await imgFile.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "products",
                public_id: `${Date.now()}-${imgFile.name.replace(/\s+/g, "-").split(".")[0]}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          const uploadedFile = uploadResponse as any;
          uploadedImages.push({
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            width: uploadedFile.width,
            height: uploadedFile.height,
            format: uploadedFile.format,
            bytes: uploadedFile.bytes,
            isPrimary: i === 0
          });
        }
      }
    }

    // Build variants array
    const variants = [];
    if (variantNames && variantNames.length > 0) {
      for (let i = 0; i < variantNames.length; i++) {
        if (variantNames[i] && variantPrices[i]) {
          variants.push({
            name: variantNames[i],
            unit: variantUnits[i] || 'piece',
            price: parseFloat(variantPrices[i]),
            quantity: parseInt(variantQuantities[i]) || 0,
            sku: variantSkus[i] || '',
            isDefault: variantIsDefault[i] === 'true' || i === 0,
            supplierAvailable: false,
            supplierName: ''
          });
        }
      }
    }

    // Create product
    const newProduct = await Product.create({
      name,
      price: price ? parseFloat(price) : undefined,
      category,
      chassisNumber: chassisNumber && chassisNumber.trim() ? chassisNumber.trim() : null,
      description: description || "",
      imageUrl: imageUrl || (uploadedImages.length > 0 ? uploadedImages[0].url : ''),
      cloudinaryPublicId: cloudinaryPublicId || (uploadedImages.length > 0 ? uploadedImages[0].publicId : ''),
      cloudinaryAssetInfo: cloudinaryAssetInfo || (uploadedImages.length > 0 ? {
        width: uploadedImages[0].width,
        height: uploadedImages[0].height,
        format: uploadedImages[0].format || 'unknown',
        bytes: uploadedImages[0].bytes || 0
      } : null),
      // Multiple images
      images: uploadedImages.length > 0 ? uploadedImages : [],
      // Variants
      variants: variants.length > 0 ? variants : [],
      // Inventory fields
      quantity: variants.length > 0 ? 0 : quantity,
      supplierAvailable: variants.length > 0 ? false : supplierAvailable,
      supplierName: variants.length > 0 ? "" : (supplierAvailable ? supplierName : ""),
      supplierDeliveryTime: variants.length > 0 ? "10-21 business days" : (supplierAvailable ? supplierDeliveryTime : "10-21 business days"),
      supplierShippingCost: variants.length > 0 ? 0 : (supplierAvailable ? supplierShippingCost : 0),
      restockDate: (!quantity && !supplierAvailable && restockDate) ? new Date(restockDate) : null,
      lowStockThreshold,
      // Shipping Options
      shippingOptions: supplierAvailable && variants.length === 0 ? {
        air: {
          enabled: airEnabled,
          deliveryTime: airDeliveryTime,
          cost: airCost,
          description: airDescription
        },
        sea: {
          enabled: seaEnabled,
          deliveryTime: seaDeliveryTime,
          cost: seaCost,
          description: seaDescription
        }
      } : undefined
    });

    return NextResponse.json(
      { message: "Product created successfully.", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server data processing crash." },
      { status: 500 }
    );
  }
}

// 3. PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const chassisNumber = formData.get("chassisNumber") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File | null;
    
    // Multiple images support
    const imageFiles = formData.getAll("images") as File[];
    const existingImageUrls = formData.getAll("existingImages") as string[];
    const primaryImageIndex = parseInt(formData.get("primaryImageIndex") as string) || 0;
    
    // Variants with units and prices
    const variantNames = formData.getAll("variants[name]") as string[];
    const variantUnits = formData.getAll("variants[unit]") as string[];
    const variantPrices = formData.getAll("variants[price]") as string[];
    const variantQuantities = formData.getAll("variants[quantity]") as string[];
    const variantSkus = formData.getAll("variants[sku]") as string[];
    const variantIsDefault = formData.getAll("variants[isDefault]") as string[];
    const variantIds = formData.getAll("variants[id]") as string[];
    const variantToRemove = formData.getAll("variants[remove]") as string[];
    
    // Inventory fields
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const supplierAvailable = formData.get("supplierAvailable") === "true";
    const supplierName = formData.get("supplierName") as string || "";
    const supplierDeliveryTime = formData.get("supplierDeliveryTime") as string || "10-21 business days";
    const supplierShippingCost = parseFloat(formData.get("supplierShippingCost") as string) || 0;
    const restockDate = formData.get("restockDate") as string || null;
    const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string) || 5;
    
    // Shipping Options - Air
    const airEnabled = formData.get("shippingOptions[air][enabled]") === "true";
    const airDeliveryTime = formData.get("shippingOptions[air][deliveryTime]") as string || "3-7 business days";
    const airCost = parseFloat(formData.get("shippingOptions[air][cost]") as string) || 0;
    const airDescription = formData.get("shippingOptions[air][description]") as string || "Express shipping by air freight";
    
    // Shipping Options - Sea
    const seaEnabled = formData.get("shippingOptions[sea][enabled]") === "true";
    const seaDeliveryTime = formData.get("shippingOptions[sea][deliveryTime]") as string || "20-35 business days";
    const seaCost = parseFloat(formData.get("shippingOptions[sea][cost]") as string) || 0;
    const seaDescription = formData.get("shippingOptions[sea][description]") as string || "Standard shipping by sea freight";

    // Validate required fields
    if (!id || !name || !category) {
      return NextResponse.json(
        { message: "Missing required details to update item." },
        { status: 400 }
      );
    }

    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return NextResponse.json(
        { message: "Product not found in index." },
        { status: 404 }
      );
    }

    // Check if chassis number is being changed and if it already exists
    const trimmedChassis = chassisNumber && chassisNumber.trim() ? chassisNumber.trim() : null;
    if (trimmedChassis !== currentProduct.chassisNumber) {
      if (trimmedChassis) {
        const existingProduct = await Product.findOne({ 
          chassisNumber: trimmedChassis, 
          _id: { $ne: id } 
        });
        if (existingProduct) {
          return NextResponse.json(
            { message: "Another product with this chassis number already exists." },
            { status: 400 }
          );
        }
      }
    }

    // Handle image updates
    let imageUrl = currentProduct.imageUrl;
    let cloudinaryPublicId = currentProduct.cloudinaryPublicId;
    let cloudinaryAssetInfo = currentProduct.cloudinaryAssetInfo;
    
    // Define the type for uploaded images
    interface UploadedImage {
      url: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
      isPrimary: boolean;
    }
    
    const uploadedImages: UploadedImage[] = [];

    // Handle existing images (keep those not removed)
    const imagesToKeep = currentProduct.images || [];
    const finalImages = [];

    // Process existing images
    if (existingImageUrls && existingImageUrls.length > 0) {
      for (const imgUrl of existingImageUrls) {
        const existingImg = imagesToKeep.find((img: any) => img.url === imgUrl);
        if (existingImg) {
          finalImages.push({
            ...existingImg.toObject ? existingImg.toObject() : existingImg,
            isPrimary: finalImages.length === 0
          });
        }
      }
    }

    // Upload new images
    if (imageFiles && imageFiles.length > 0) {
      for (const imgFile of imageFiles) {
        if (imgFile.size > 0) {
          const bytes = await imgFile.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "products",
                public_id: `${Date.now()}-${imgFile.name.replace(/\s+/g, "-").split(".")[0]}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          const uploadedFile = uploadResponse as any;
          uploadedImages.push({
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            width: uploadedFile.width,
            height: uploadedFile.height,
            format: uploadedFile.format,
            bytes: uploadedFile.bytes,
            isPrimary: finalImages.length === 0 && uploadedImages.length === 0
          });
        }
      }
    }

    // Combine kept and new images
    const allImages = [...finalImages, ...uploadedImages];
    
    // Set primary image
    if (allImages.length > 0) {
      allImages.forEach((img, index) => {
        img.isPrimary = index === (primaryImageIndex || 0);
      });
    }

    // Handle single image upload (legacy)
    if (file && file.size > 0) {
      // Delete old image
      if (currentProduct.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(currentProduct.cloudinaryPublicId);
        } catch (cloudinaryErr) {
          console.warn("Cloudinary image deletion warning:", cloudinaryErr);
        }
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            public_id: `${Date.now()}-${file.name.replace(/\s+/g, "-").split(".")[0]}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      const uploadedFile = uploadResponse as any;
      imageUrl = uploadedFile.secure_url;
      cloudinaryPublicId = uploadedFile.public_id;
      cloudinaryAssetInfo = {
        width: uploadedFile.width,
        height: uploadedFile.height,
        format: uploadedFile.format,
        bytes: uploadedFile.bytes,
      };
    }

    // Build variants array
    const variants = [];
    if (variantNames && variantNames.length > 0) {
      // Remove variants marked for deletion
      const removeIds = variantToRemove || [];
      
      for (let i = 0; i < variantNames.length; i++) {
        const variantId = variantIds[i] || '';
        
        // Skip if marked for removal
        if (removeIds.includes(variantId)) {
          continue;
        }
        
        if (variantNames[i] && variantPrices[i]) {
          variants.push({
            _id: variantId || undefined,
            name: variantNames[i],
            unit: variantUnits[i] || 'piece',
            price: parseFloat(variantPrices[i]),
            quantity: parseInt(variantQuantities[i]) || 0,
            sku: variantSkus[i] || '',
            isDefault: variantIsDefault[i] === 'true' || (variants.length === 0 && i === 0)
          });
        }
      }
    }

    // Update all fields
    currentProduct.name = name;
    currentProduct.price = price ? parseFloat(price) : undefined;
    currentProduct.category = category;
    currentProduct.chassisNumber = trimmedChassis;
    currentProduct.description = description || currentProduct.description || "";
    currentProduct.imageUrl = imageUrl;
    currentProduct.cloudinaryPublicId = cloudinaryPublicId;
    currentProduct.cloudinaryAssetInfo = cloudinaryAssetInfo;
    
    // Update images
    currentProduct.images = allImages.length > 0 ? allImages : [];
    
    // Update variants
    currentProduct.variants = variants.length > 0 ? variants : [];
    
    // Update inventory fields (only if no variants)
    if (variants.length === 0) {
      currentProduct.quantity = quantity;
      currentProduct.supplierAvailable = supplierAvailable;
      currentProduct.supplierName = supplierAvailable ? supplierName : "";
      currentProduct.supplierDeliveryTime = supplierAvailable ? supplierDeliveryTime : "10-21 business days";
      currentProduct.supplierShippingCost = supplierAvailable ? supplierShippingCost : 0;
      currentProduct.restockDate = (!quantity && !supplierAvailable && restockDate) ? new Date(restockDate) : null;
      currentProduct.lowStockThreshold = lowStockThreshold;
      
      // Update shipping options
      if (supplierAvailable) {
        currentProduct.shippingOptions = {
          air: {
            enabled: airEnabled,
            deliveryTime: airDeliveryTime,
            cost: airCost,
            description: airDescription
          },
          sea: {
            enabled: seaEnabled,
            deliveryTime: seaDeliveryTime,
            cost: seaCost,
            description: seaDescription
          }
        };
      } else {
        currentProduct.shippingOptions = undefined;
      }
    } else {
      // Reset main inventory when variants exist
      currentProduct.quantity = 0;
      currentProduct.supplierAvailable = false;
      currentProduct.supplierName = "";
      currentProduct.supplierDeliveryTime = "10-21 business days";
      currentProduct.supplierShippingCost = 0;
      currentProduct.restockDate = null;
      currentProduct.shippingOptions = undefined;
    }
    
    await currentProduct.save();

    return NextResponse.json(
      { message: "Product updated successfully.", product: currentProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update product payload data." },
      { status: 500 }
    );
  }
}

// 4. DELETE: Purge product item records
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing targeting product ID parameter." },
        { status: 400 }
      );
    }

    const productToDelete = await Product.findById(id);
    if (!productToDelete) {
      return NextResponse.json(
        { message: "Target document could not be found." },
        { status: 404 }
      );
    }

    // Delete all images from Cloudinary
    try {
      // Delete main image
      if (productToDelete.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(productToDelete.cloudinaryPublicId);
      }
      
      // Delete multiple images
      if (productToDelete.images && productToDelete.images.length > 0) {
        for (const img of productToDelete.images) {
          if (img.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
          }
        }
      }
    } catch (cloudinaryErr) {
      console.warn("Cloudinary image deletion warning:", cloudinaryErr);
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Product item permanently dropped from system matrix." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to handle record deletion." },
      { status: 500 }
    );
  }
}