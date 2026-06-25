import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export function serializeCategory(category) {
  return {
    _id: category._id.toString(),
    name: category.name,
    description: category.description,
    type: category.type || "tag",
    createdAt: category.createdAt?.toISOString(),
    updatedAt: category.updatedAt?.toISOString(),
  };
}

export async function getCategories() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories.map(serializeCategory);
}

export async function getMainCategories() {
  await connectDB();
  const categories = await Category.find({ type: "main" }).sort({ name: 1 }).lean();
  return categories.map(serializeCategory);
}

export async function getTagCategories() {
  await connectDB();
  const categories = await Category.find({ type: "tag" }).sort({ name: 1 }).lean();
  return categories.map(serializeCategory);
}

export async function getCategoryById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const category = await Category.findById(id).lean();
  return category ? serializeCategory(category) : null;
}
