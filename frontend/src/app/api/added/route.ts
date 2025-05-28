/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import UserDetail from '@/model/UserDetail'; // your mongoose model
// import * as jwt from 'jsonwebtoken'
export async function GET(req: NextRequest) {
  await connectDB();
  // const secret='supersecretkey'
  // const token: any = localStorage.getItem("token");
  // const decoded: any= jwt.verify(token, secret)

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const userId=searchParams.get('userId')
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await UserDetail.countDocuments();
    console.log(`userId=${userId}`)
    const users = await UserDetail.find({'owner': userId}).skip(skip).limit(limit);

    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
