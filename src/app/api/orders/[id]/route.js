import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["Active", "Closed", "Shipped", "Canceled"];

export async function PATCH(request, { params }) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order: { ...order, _id: order._id.toString() } });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update order." },
      { status: 500 }
    );
  }
}
