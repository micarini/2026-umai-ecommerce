import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { isOwnSession } from "@/lib/user-auth";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { userId, orderId } = await params;

    if (!(await isOwnSession(userId))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findOne({ _id: orderId, "user.userId": userId }).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order: { ...order, _id: order._id.toString() } });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to get order." },
      { status: 500 }
    );
  }
}
