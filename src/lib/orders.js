import { connectDB } from "@/lib/mongodb";
import Counter from "@/models/Counter";
import Order from "@/models/Order";

export async function getNextOrderNumber() {
  await connectDB();
  const counter = await Counter.findOneAndUpdate(
    { _id: "orderNumber" },
    [{ $set: { seq: { $add: [{ $ifNull: ["$seq", 999] }, 1] } } }],
    { upsert: true, returnDocument: "after", updatePipeline: true }
  );
  return counter.seq;
}

function serializeOrder(order) {
  return { ...order, _id: order._id.toString() };
}

export async function getAllOrders() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return orders.map(serializeOrder);
}

export async function getOrderByIdAdmin(id) {
  await connectDB();
  const order = await Order.findById(id).lean();
  return order ? serializeOrder(order) : null;
}

export async function getRecentOrders(limit = 5) {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(limit).lean();
  return orders.map(serializeOrder);
}

export async function getMonthlyTotal() {
  await connectDB();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth },
        status: { $ne: "Canceled" },
      },
    },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  return result[0]?.total || 0;
}
