// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Product from "@/models/Product";
// import { writeFile, mkdir, unlink } from "fs/promises";
// import path from "path";

// // 1. GET: Fetch all products
// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find({}).sort({ createdAt: -1 });
//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch store inventory records." }, { status: 500 });
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
//       return NextResponse.json({ message: "Missing required fields or image asset." }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//     const targetFilePath = path.join(uploadDir, uniqueFileName);

//     await mkdir(uploadDir, { recursive: true });
//     await writeFile(targetFilePath, buffer);
//     const imageUrl = `/uploads/${uniqueFileName}`;

//     const newProduct = await Product.create({
//       name,
//       price: parseFloat(price),
//       category,
//       imageUrl,
//     });

//     return NextResponse.json({ message: "Product created dynamically.", product: newProduct }, { status: 201 });
//   } catch (error: any) {
//     console.error("Product creation error:", error);
//     return NextResponse.json({ message: "Internal server data processing crash." }, { status: 500 });
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
//       return NextResponse.json({ message: "Missing required details to update item." }, { status: 400 });
//     }

//     const currentProduct = await Product.findById(id);
//     if (!currentProduct) {
//       return NextResponse.json({ message: "Product not found in index." }, { status: 404 });
//     }

//     let imageUrl = currentProduct.imageUrl;

//     // If a new image file is supplied, overwrite the asset location
//     if (file && file.size > 0) {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const uploadDir = path.join(process.cwd(), "public", "uploads");
//       const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//       await writeFile(path.join(uploadDir, uniqueFileName), buffer);
//       imageUrl = `/uploads/${uniqueFileName}`;
//     }

//     currentProduct.name = name;
//     currentProduct.price = parseFloat(price);
//     currentProduct.category = category;
//     currentProduct.imageUrl = imageUrl;
//     await currentProduct.save();

//     return NextResponse.json({ message: "Product updated successfully.", product: currentProduct }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ message: "Failed to update product payload data." }, { status: 500 });
//   }
// }

// // 4. DELETE: Purge product item records
// export async function DELETE(request: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json({ message: "Missing targeting product ID parameter." }, { status: 400 });
//     }

//     const productToDelete = await Product.findById(id);
//     if (!productToDelete) {
//       return NextResponse.json({ message: "Target document could not be found." }, { status: 404 });
//     }

//     // Try to remove the file from local public filesystem storage directory
//     try {
//       const filePath = path.join(process.cwd(), "public", productToDelete.imageUrl);
//       await unlink(filePath);
//     } catch (fsErr) {
//       console.warn("Local image file asset was already missing or cleared.");
//     }

//     await Product.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Product item permanently dropped from system matrix." }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ message: "Failed to handle record deletion." }, { status: 500 });
//   }




import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// 1. GET: Fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
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
    const file = formData.get("image") as File | null;

    if (!name || !price || !category || !file) {
      return NextResponse.json(
        { message: "Missing required fields or image asset." },
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

    const imageUrl = (uploadResponse as any).secure_url;

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      category,
      imageUrl,
    });

    return NextResponse.json(
      { message: "Product created successfully.", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { message: "Internal server data processing crash." },
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
    const file = formData.get("image") as File | null;

    if (!id || !name || !price || !category) {
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

    let imageUrl = currentProduct.imageUrl;

    // If a new image file is supplied, upload to Cloudinary
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Delete old image from Cloudinary if exists
      if (currentProduct.imageUrl) {
        const publicId = currentProduct.imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
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

      imageUrl = (uploadResponse as any).secure_url;
    }

    currentProduct.name = name;
    currentProduct.price = parseFloat(price);
    currentProduct.category = category;
    currentProduct.imageUrl = imageUrl;
    await currentProduct.save();

    return NextResponse.json(
      { message: "Product updated successfully.", product: currentProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { message: "Failed to update product payload data." },
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

    // Delete image from Cloudinary
    try {
      if (productToDelete.imageUrl) {
        const publicId = productToDelete.imageUrl
          .split("/")
          .pop()
          ?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
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
      { message: "Failed to handle record deletion." },
      { status: 500 }
    );
  }
}