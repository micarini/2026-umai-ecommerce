import mongoose from "mongoose";

import { getCategoryById } from "@/lib/categories";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function invalidIdResponse() {
  return Response.json({ message: "Invalid category ID" }, { status: 400 });
}

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const category = await getCategoryById(id);

    if (!category) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    return Response.json(category);
  } catch (error) {
    return Response.json(
      { message: "Error fetching the category", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const body = await request.json();
    await connectDB();

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    return Response.json(category);
  } catch (error) {
    return Response.json(
      { message: "Error updating the category", error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    await Product.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );

    return Response.json({ message: "Category deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: "Error deleting the category", error: error.message },
      { status: 500 }
    );
  }
}
