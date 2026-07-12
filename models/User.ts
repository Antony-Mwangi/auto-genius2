// import mongoose, { Schema, Document } from "mongoose";

// // 1. Define an interface for the User Document (Excellent for autocomplete/TS safety)
// export interface IUser extends Document {
//   fullName: string;
//   email: string;
//   phone: string;
//   password?: string;
//   role: "customer" | "admin"; // Enforces fixed roles
//   createdAt: Date;
//   updatedAt: Date;
// }

// // 2. Define the Schema
// const UserSchema = new Schema<IUser>(
//   {
//     fullName: {
//       type: String,
//       required: [true, "Full name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true, // Automatically converts emails to lowercase to prevent duplicates
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: [true, "Phone number is required"],
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     role: {
//       type: String,
//       enum: ["customer", "admin"], // Restricts values to only these options
//       default: "customer",
//     },
//   },
//   {
//     timestamps: true, // Automatically creates and manages createdAt & updatedAt fields
//   }
// );

// // 3. Compile and Export the Model safely
// const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
// export default User;




// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;