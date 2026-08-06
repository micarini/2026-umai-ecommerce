import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { isOwnSession } from "@/lib/user-auth";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    if (!(await isOwnSession(userId))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ "user.userId": userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      orders: orders.map((order) => ({ ...order, _id: order._id.toString() })),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to get orders." },
      { status: 500 }
    );
  }
}
