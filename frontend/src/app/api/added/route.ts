/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import UserDetail from "@/model/UserDetail";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const userId = searchParams.get("userId");
  const search: any = searchParams.get("search") || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    // const isNumber=!isNaN(search)
    const query: any = {
      owner: userId,
      
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contact: {$regex: search, $options: "i" } },
        
      ]

    };
    

    const totalCount = await UserDetail.countDocuments(query);
    const users = await UserDetail.find(query).skip(skip).limit(limit);

    return NextResponse.json({
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
