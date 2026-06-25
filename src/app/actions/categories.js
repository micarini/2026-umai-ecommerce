"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import Category from "@/models/Category";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import {
  ADMIN_SESSION_COOKIE,
  getExpectedAdminSessionToken,
} from "@/lib/admin-auth";

function getCategoryPayload(formData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
  };
}

function revalidateCategoryViews() {
  revalidatePath("/");
  revalidatePath("/dashboard");
}

async function assertAdminAccess() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return false;
  }

  const expectedSessionToken = await getExpectedAdminSessionToken().catch(() => null);
  return Boolean(expectedSessionToken && sessionToken === expectedSessionToken);
}

export async function createCategory(_previousState, formData) {
  try {
    if (!(await assertAdminAccess())) {
      return { ok: false, message: "Unauthorized." };
    }

    await connectDB();
    await Category.create(getCategoryPayload(formData));
    revalidateCategoryViews();

    return { ok: true, message: "Category created." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error when creating the category.",
    };
  }
}

export async function updateCategory(id, _previousState, formData) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid category ID." };
  }

  try {
    if (!(await assertAdminAccess())) {
      return { ok: false, message: "Unauthorized." };
    }

    await connectDB();

    const category = await Category.findByIdAndUpdate(
      id,
      getCategoryPayload(formData),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return { ok: false, message: "Category not found." };
    }

    revalidateCategoryViews();
    return { ok: true, message: "Category updated." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error when updating the category.",
    };
  }
}

export async function deleteCategory(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid category ID." };
  }

  try {
    if (!(await assertAdminAccess())) {
      return { ok: false, message: "Unauthorized." };
    }

    await connectDB();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return { ok: false, message: "Category not found." };
    }

    await Product.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );

    revalidateCategoryViews();
    return { ok: true, message: "Category deleted." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error when deleting the category.",
    };
  }
}
