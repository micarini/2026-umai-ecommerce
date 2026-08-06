import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function getRecentUsers(limit = 5) {
  await connectDB();
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return users.map((user) => ({ ...user, _id: user._id.toString() }));
}
