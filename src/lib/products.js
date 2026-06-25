import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Product from "@/models/Product";
import { serializeCategory } from "@/lib/categories";

function serializeCustomization(c) {
  return {
    name: c.name,
    description: c.description || "",
    required: c.required ?? true,
    multiSelect: c.multiSelect ?? false,
    options: (c.options || []).map((o) => ({
      label: o.label,
      price: o.price ?? 0,
    })),
  };
}

function serializeProduct(product) {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: product.image,
    type: product.type || "regular",
    categories: (product.categories || []).map((category) => {
      if (category?.name) return serializeCategory(category);
      return category.toString();
    }),
    customizations: (product.customizations || []).map(serializeCustomization),
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };
}

export async function getProducts() {
  await connectDB();
  const products = await Product.find()
    .populate("categories")
    .sort({ createdAt: -1 })
    .lean();
  return products.map(serializeProduct);
}

export async function getProductById(id) {
  await connectDB();
  const product = await Product.findById(id).populate("categories").lean();
  return product ? serializeProduct(product) : null;
}

export async function getProductsByCategory(categoryId) {
  await connectDB();
  const products = await Product.find({ categories: categoryId })
    .populate("categories")
    .sort({ createdAt: -1 })
    .lean();
  return products.map(serializeProduct);
}

export async function getRelatedProducts(productId, categoryIds, limit = 3) {
  await connectDB();
  const products = await Product.find({
    _id: { $ne: productId },
    categories: { $in: categoryIds },
  })
    .populate("categories")
    .limit(limit)
    .lean();
  return products.map(serializeProduct);
}
