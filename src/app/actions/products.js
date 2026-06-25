"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Product from "@/models/Product";
import {
  ADMIN_SESSION_COOKIE,
  getExpectedAdminSessionToken,
} from "@/lib/admin-auth";

function getProductPayload(formData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    image: formData.get("image"),
    categories: formData
      .getAll("categories")
      .filter((categoryId) => mongoose.Types.ObjectId.isValid(categoryId)),
  };
}

function revalidateProductsDashboard() {
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

export async function createProduct(_previousState, formData) {
  try {
    if (!(await assertAdminAccess())) {
      return { ok: false, message: "Unauthorized." };
    }

    await connectDB();
    await Product.create(getProductPayload(formData));
    revalidateProductsDashboard();

    return { ok: true, message: "Product created." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error when creating the product.",
    };
  }
}

export async function updateProduct(id, _previousState, formData) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid product ID." };
  }

  try {
    if (!(await assertAdminAccess())) {
      return { ok: false, message: "Unauthorized." };
    }

    await connectDB();

    const product = await Product.findByIdAndUpdate(id, getProductPayload(formData), {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return { ok: false, message: "Product not found." };
    }

    revalidateProductsDashboard();
    return { ok: true, message: "Product updated." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error when updating the product.",
    };
  }
}

export async function deleteProduct(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid product ID." };
  }

  try {
    if (!(await assertAdminAccess())) {
      return { ok: false, message: "Unauthorized." };
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return { ok: false, message: "Product not found." };
    }

    revalidateProductsDashboard();
    return { ok: true, message: "Product deleted." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error when deleting the product.",
    };
  }
}
