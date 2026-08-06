import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Product from "@/models/Product";
import { serializeCategory } from "@/lib/categories";

const DEFAULT_CATEGORY_PRODUCTS = {
  Drinks: [
    {
      name: "Matcha Iced Tea",
      description: "Té verde matcha orgánico batido en frío con un toque de limón fresco y miel.",
      price: 3.99,
      stock: 50,
      image: "/images/drinks/matcha-iced-tea.png",
    },
    {
      name: "Sparkling Yuzu Lemonade",
      description: "Refrescante limonada artesanal infusionada con cítrico japonés Yuzu y burbujas finas.",
      price: 4.5,
      stock: 40,
      image: "/images/drinks/sparkling-yuzu-lemonade.png",
    },
    {
      name: "Lychee Dragonfruit Boba",
      description: "Té refrescante de fruta del dragón y lichi con perlas de tapioca y leche de coco.",
      price: 5.5,
      stock: 35,
      image: "/images/drinks/lychee-dragonfruit-boba.png",
    },
    {
      name: "Hibiscus Ginger Infusion",
      description: "Soda artesanal de flor de hibisco (jamaica) con jengibre picante fresco y lima.",
      price: 4.25,
      stock: 45,
      image: "/images/drinks/hibiscus-ginger-infusion.png",
    },
    {
      name: "Cold Brew Kombucha Ginger",
      description: "Kombucha artesanal probiótica fermentada con jengibre fresco y té negro.",
      price: 4.99,
      stock: 30,
      image: "/images/drinks/cold-brew-kombucha-ginger.png",
    },
    {
      name: "Japanese Peach Sparkler",
      description: "Bebida efervescente dulce con pulpa natural de durazno blanco japonés Momo.",
      price: 4.5,
      stock: 40,
      image: "/images/drinks/japanese-peach-sparkler.png",
    },
  ],
  Desserts: [
    {
      name: "Mochi Ice Cream Trio",
      description: "Trío de mochi de arroz glutinoso relleno de helado sabor Matcha, Mango y Sésamo Negro.",
      price: 5.99,
      stock: 25,
      image: "/images/desserts/mochi-ice-cream-trio.png",
    },
    {
      name: "Matcha Uji Cheesecake",
      description: "Cheesecake cremoso horneado e infusionado con té verde Matcha de grado ceremonial.",
      price: 6.5,
      stock: 20,
      image: "/images/desserts/matcha-uji-cheesecake.png",
    },
    {
      name: "Mango Coconut Tapioca",
      description: "Pudding de perlas de tapioca en suave leche de coco con cubos de mango fresco.",
      price: 5.25,
      stock: 30,
      image: "/images/desserts/mango-coconut-tapioca.png",
    },
    {
      name: "Taiyaki Soft Serve",
      description: "Waffle japonés crocante relleno de Nutella, coronado con helado suave mixto.",
      price: 6.99,
      stock: 15,
      image: "/images/desserts/taiyaki-soft-serve.png",
    },
    {
      name: "Yuzu Meringue Tartlet",
      description: "Tarta artesanal con curd de Yuzu japonés y merengue italiano ligeramente tostado.",
      price: 5.75,
      stock: 18,
      image: "/images/desserts/yuzu-meringue-tartlet.png",
    },
    {
      name: "Black Sesame Panna Cotta",
      description: "Panna cotta cremosa de sésamo negro tostado servida con coulis de maracuyá.",
      price: 5.5,
      stock: 22,
      image: "/images/desserts/black-sesame-panna-cotta.png",
    },
  ],
};

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

// "Build Your Own Bowl" (type "custom") siempre va primero en el listado.
function customFirst(a, b) {
  if (a.type === "custom" && b.type !== "custom") return -1;
  if (b.type === "custom" && a.type !== "custom") return 1;
  return 0;
}

export async function getProducts() {
  await connectDB();
  const products = await Product.find()
    .populate("categories")
    .sort({ createdAt: 1 })
    .lean();
  return products.map(serializeProduct).sort(customFirst);
}

export async function getProductById(id) {
  await connectDB();
  const product = await Product.findById(id).populate("categories").lean();
  return product ? serializeProduct(product) : null;
}

export async function getProductsByCategory(categoryId) {
  await connectDB();
  const category = await Product.db.model("Category").findById(categoryId).lean();
  const products = await Product.find({ categories: categoryId })
    .populate("categories")
    .sort({ createdAt: 1 })
    .lean();

  if (products.length === 0 && category?.type === "main" && DEFAULT_CATEGORY_PRODUCTS[category.name]) {
    for (const productData of DEFAULT_CATEGORY_PRODUCTS[category.name]) {
      await Product.findOneAndUpdate(
        { name: productData.name },
        {
          $set: {
            ...productData,
            type: "regular",
            categories: [categoryId],
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    const seededProducts = await Product.find({ categories: categoryId })
      .populate("categories")
      .sort({ createdAt: 1 })
      .lean();

    return seededProducts.map(serializeProduct).sort(customFirst);
  }

  return products.map(serializeProduct).sort(customFirst);
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

export async function getLowStockProducts() {
  await connectDB();
  const products = await Product.find({ stock: { $lte: 5 } })
    .populate("categories")
    .sort({ stock: 1 })
    .lean();
  return products.map(serializeProduct);
}
