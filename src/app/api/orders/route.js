import { connectDB } from "@/lib/mongodb";
import { getNextOrderNumber } from "@/lib/orders";
import { isOwnSession } from "@/lib/user-auth";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, email, address, notes, shippingMethod, items, total } = body;

    if (!userId || !name || !email) {
      return Response.json(
        { message: "Missing user data for the order." },
        { status: 400 }
      );
    }

    if (!(await isOwnSession(userId))) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { message: "Order must include at least one item." },
        { status: 400 }
      );
    }

    const resolvedShippingMethod = shippingMethod === "pickup" ? "pickup" : "delivery";

    if (resolvedShippingMethod === "delivery" && !address) {
      return Response.json(
        { message: "Address is required for delivery orders." },
        { status: 400 }
      );
    }

    await connectDB();

    const orderNumber = await getNextOrderNumber();

    const order = await Order.create({
      orderNumber,
      status: "Active",
      user: { userId, name, email },
      contact: {
        address: address || "",
        notes: notes || "",
        shippingMethod: resolvedShippingMethod,
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        unitPrice: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
        subtotal: item.subtotal,
      })),
      total,
    });

    return Response.json(
      { _id: order._id.toString(), orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error creating order", error: error.message },
      { status: 500 }
    );
  }
}
