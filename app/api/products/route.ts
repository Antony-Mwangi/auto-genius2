



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Product from "@/models/Product";
// import cloudinary from "@/lib/cloudinary";

// // 1. GET: Fetch all products
// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find({}).sort({ createdAt: -1 });
//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
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
//     const file = formData.get("image") as File | null;

//     if (!name || !price || !category || !file) {
//       return NextResponse.json(
//         { message: "Missing required fields or image asset." },
//         { status: 400 }
//       );
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

//     const imageUrl = (uploadResponse as any).secure_url;

//     const newProduct = await Product.create({
//       name,
//       price: parseFloat(price),
//       category,
//       imageUrl,
//     });

//     return NextResponse.json(
//       { message: "Product created successfully.", product: newProduct },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Product creation error:", error);
//     return NextResponse.json(
//       { message: "Internal server data processing crash." },
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
//     const file = formData.get("image") as File | null;

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

//     let imageUrl = currentProduct.imageUrl;

//     // If a new image file is supplied, upload to Cloudinary
//     if (file && file.size > 0) {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       // Delete old image from Cloudinary if exists
//       if (currentProduct.imageUrl) {
//         const publicId = currentProduct.imageUrl.split("/").pop()?.split(".")[0];
//         if (publicId) {
//           await cloudinary.uploader.destroy(`products/${publicId}`);
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

//       imageUrl = (uploadResponse as any).secure_url;
//     }

//     currentProduct.name = name;
//     currentProduct.price = parseFloat(price);
//     currentProduct.category = category;
//     currentProduct.imageUrl = imageUrl;
//     await currentProduct.save();

//     return NextResponse.json(
//       { message: "Product updated successfully.", product: currentProduct },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Product update error:", error);
//     return NextResponse.json(
//       { message: "Failed to update product payload data." },
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

//     // Delete image from Cloudinary
//     try {
//       if (productToDelete.imageUrl) {
//         const publicId = productToDelete.imageUrl
//           .split("/")
//           .pop()
//           ?.split(".")[0];
//         if (publicId) {
//           await cloudinary.uploader.destroy(`products/${publicId}`);
//         }
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
//       { message: "Failed to handle record deletion." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// 1. GET: Fetch all products or search by chassis number
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const chassisNumber = searchParams.get("chassisNumber");
    const searchTerm = searchParams.get("search");
    
    // Search by exact chassis number
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
    
    // Search by text (chassis number, name, or description)
    if (searchTerm) {
      const products = await Product.find({
        $or: [
          { chassisNumber: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
      return NextResponse.json(products, { status: 200 });
    }
    
    // Return all products if no search params
    const products = await Product.find({}).sort({ createdAt: -1 });
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

    // Validate required fields
    if (!name || !price || !category || !chassisNumber || !file) {
      return NextResponse.json(
        { message: "Missing required fields. Name, price, category, chassis number, and image are required." },
        { status: 400 }
      );
    }

    // Check if chassis number already exists
    const existingProduct = await Product.findOne({ chassisNumber });
    if (existingProduct) {
      return NextResponse.json(
        { message: "A product with this chassis number already exists." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
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
    const imageUrl = uploadedFile.secure_url;
    const cloudinaryPublicId = uploadedFile.public_id;

    // Create product with all fields
    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      category,
      chassisNumber,
      description: description || "",
      imageUrl,
      cloudinaryPublicId,
      cloudinaryAssetInfo: {
        width: uploadedFile.width,
        height: uploadedFile.height,
        format: uploadedFile.format,
        bytes: uploadedFile.bytes,
      }
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

    if (!id || !name || !price || !category || !chassisNumber) {
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
    if (chassisNumber !== currentProduct.chassisNumber) {
      const existingProduct = await Product.findOne({ 
        chassisNumber, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        return NextResponse.json(
          { message: "Another product with this chassis number already exists." },
          { status: 400 }
        );
      }
    }

    let imageUrl = currentProduct.imageUrl;
    let cloudinaryPublicId = currentProduct.cloudinaryPublicId;
    let cloudinaryAssetInfo = currentProduct.cloudinaryAssetInfo;

    // If a new image file is supplied, upload to Cloudinary
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Delete old image from Cloudinary if exists
      if (currentProduct.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(currentProduct.cloudinaryPublicId);
        } catch (cloudinaryErr) {
          console.warn("Cloudinary image deletion warning:", cloudinaryErr);
        }
      }

      // Upload new image to Cloudinary
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

    // Update all fields
    currentProduct.name = name;
    currentProduct.price = parseFloat(price);
    currentProduct.category = category;
    currentProduct.chassisNumber = chassisNumber;
    currentProduct.description = description || currentProduct.description || "";
    currentProduct.imageUrl = imageUrl;
    currentProduct.cloudinaryPublicId = cloudinaryPublicId;
    currentProduct.cloudinaryAssetInfo = cloudinaryAssetInfo;
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

    // Delete image from Cloudinary using stored public ID
    try {
      if (productToDelete.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(productToDelete.cloudinaryPublicId);
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