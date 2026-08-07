import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Product from "@/models/Product";
import { serializeCategory } from "@/lib/categories";

const DEFAULT_CATEGORY_PRODUCTS = {
  Drinks: [
    {
      name: "Matcha Iced Tea",
      description: "Organic matcha green tea shaken cold with a touch of fresh lemon and honey.",
      price: 3.99,
      stock: 50,
      image: "/images/drinks/matcha-iced-tea.png",
    },
    {
      name: "Sparkling Yuzu Lemonade",
      description: "Refreshing artisanal lemonade infused with Japanese Yuzu citrus and fine bubbles.",
      price: 4.50,
      stock: 40,
      image: "/images/drinks/sparkling-yuzu-lemonade.png",
    },
    {
      name: "Lychee Dragonfruit Boba",
      description: "Refreshing dragonfruit and lychee tea with tapioca pearls and coconut milk.",
      price: 5.50,
      stock: 35,
      image: "/images/drinks/lychee-dragonfruit-boba.png",
    },
    {
      name: "Hibiscus Ginger Infusion",
      description: "Artisanal hibiscus flower soda with fresh spicy ginger and lime.",
      price: 4.25,
      stock: 45,
      image: "/images/drinks/hibiscus-ginger-infusion.png",
    },
    {
      name: "Cold Brew Kombucha Ginger",
      description: "Artisanal probiotic kombucha fermented with fresh ginger and black tea.",
      price: 4.99,
      stock: 30,
      image: "/images/drinks/cold-brew-kombucha-ginger.png",
    },
    {
      name: "Japanese Peach Sparkler",
      description: "Sweet sparkling drink with natural pulp from Japanese white Momo peach.",
      price: 4.50,
      stock: 40,
      image: "/images/drinks/japanese-peach-sparkler.png",
    },
  ],
  Desserts: [
    {
      name: "Mochi Ice Cream Trio",
      description: "Trio of glutinous rice mochi filled with Matcha, Mango and Black Sesame ice cream.",
      price: 5.99,
      stock: 25,
      image: "/images/desserts/mochi-ice-cream-trio.png",
    },
    {
      name: "Matcha Uji Cheesecake",
      description: "Creamy baked cheesecake infused with ceremonial-grade Matcha green tea.",
      price: 6.50,
      stock: 20,
      image: "/images/desserts/matcha-uji-cheesecake.png",
    },
    {
      name: "Mango Coconut Tapioca",
      description: "Tapioca pearl pudding in smooth coconut milk with fresh mango cubes.",
      price: 5.25,
      stock: 30,
      image: "/images/desserts/mango-coconut-tapioca.png",
    },
    {
      name: "Taiyaki Soft Serve",
      description: "Crispy Japanese waffle filled with Nutella, topped with mixed soft serve ice cream.",
      price: 6.99,
      stock: 15,
      image: "/images/desserts/taiyaki-soft-serve.png",
    },
    {
      name: "Yuzu Meringue Tartlet",
      description: "Artisanal tartlet with Japanese Yuzu curd and lightly toasted Italian meringue.",
      price: 5.75,
      stock: 18,
      image: "/images/desserts/yuzu-meringue-tartlet.png",
    },
    {
      name: "Black Sesame Panna Cotta",
      description: "Creamy toasted black sesame panna cotta served with passion fruit coulis.",
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
