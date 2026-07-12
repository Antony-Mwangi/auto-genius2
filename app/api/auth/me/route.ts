// // app/api/auth/me/route.ts
// import { NextResponse, type NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "fallback_secret"
// );

// export async function GET(request: NextRequest) {
//   try {
//     const token = request.cookies.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: "Authentication required." },
//         { status: 401 }
//       );
//     }

//     const { payload } = await jwtVerify(token, JWT_SECRET);

//     // CHANGED: Passing both validated properties straight down to the dashboard
//     return NextResponse.json(
//       {
//         user: {
//           id: payload.id,
//           fullName: payload.fullName || "Valued Customer",
//           email: payload.email || "",
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Profile API error:", error);
//     return NextResponse.json({ error: "Invalid token structure." }, { status: 401 });
//   }
// }




// app/api/auth/me/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json(
      {
        user: {
          id: payload.id,
          fullName: payload.fullName || "Valued Customer",
          email: payload.email || "",
          role: payload.role || "customer",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Invalid token structure." }, { status: 401 });
  }
}