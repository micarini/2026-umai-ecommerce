import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

const MAIN_CATEGORY_DEFAULTS = [
  { name: "Bowls", description: "Fresh poke & sushi bowls made to order.", type: "main" },
  { name: "Drinks", description: "Fresh juices, teas and beverages.", type: "main" },
  { name: "Desserts", description: "Light and refreshing Japanese-inspired desserts.", type: "main" },
];

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

  const existingCategories = await Category.find({ type: "main" }).sort({ name: 1 }).lean();
  if (existingCategories.length === MAIN_CATEGORY_DEFAULTS.length) {
    return existingCategories.map(serializeCategory);
  }

  for (const categoryData of MAIN_CATEGORY_DEFAULTS) {
    const existing = await Category.findOne({ name: categoryData.name });

    if (existing) {
      await Category.updateOne(
        { _id: existing._id },
        { $set: { ...categoryData } }
      );
      continue;
    }

    await Category.create(categoryData);
  }

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
