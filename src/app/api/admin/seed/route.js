import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectDB();

    // 1. Crear categorías principales si no existen
    const mainCategories = [
      { name: "Bowls", description: "Fresh poke & sushi bowls made to order.", type: "main" },
      { name: "Drinks", description: "Fresh juices, teas and beverages.", type: "main" },
      { name: "Desserts", description: "Light and refreshing Japanese-inspired desserts.", type: "main" },
    ];

    const createdMain = {};
    for (const cat of mainCategories) {
      const existing = await Category.findOne({ name: cat.name });
      if (existing) {
        await Category.updateOne({ _id: existing._id }, { $set: { type: "main" } });
        createdMain[cat.name] = existing._id;
      } else {
        const created = await Category.create(cat);
        createdMain[cat.name] = created._id;
      }
    }

    // 2. Marcar categorías existentes de tags como type: "tag"
    await Category.updateMany(
      { type: { $exists: false } },
      { $set: { type: "tag" } }
    );
    await Category.updateMany(
      { name: { $in: ["Classic Bowls", "Premium Selection", "Spicy Bowls", "Vegetarian Bowls"] } },
      { $set: { type: "tag" } }
    );

    // 3. Agregar categoría "Bowls" a todos los productos existentes (si no la tienen)
    await Product.updateMany(
      { categories: { $nin: [createdMain["Bowls"]] } },
      { $addToSet: { categories: createdMain["Bowls"] } }
    );

    const drinksProducts = [
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
    ];

    for (const productData of drinksProducts) {
      await Product.findOneAndUpdate(
        { name: productData.name },
        {
          $set: {
            ...productData,
            type: "regular",
            categories: [createdMain["Drinks"]],
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    const dessertsProducts = [
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
    ];

    for (const productData of dessertsProducts) {
      await Product.findOneAndUpdate(
        { name: productData.name },
        {
          $set: {
            ...productData,
            type: "regular",
            categories: [createdMain["Desserts"]],
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    // 4. Crear "Build Your Own Bowl" si no existe
    const existingBYO = await Product.findOne({ type: "custom" });
    let byoResult = "already exists";

    if (!existingBYO) {
      await Product.create({
        name: "Build Your Own Bowl",
        description: "Create your perfect bowl from scratch. Pick your base, protein, toppings and sauce. Price is calculated from your selections.",
        price: 0,
        stock: 99,
        image: "hero-background.png",
        type: "custom",
        categories: [createdMain["Bowls"]],
        customizations: [
          {
            name: "Base",
            description: "Choose your bowl base",
            required: true,
            multiSelect: false,
            options: [
              { label: "White Rice", price: 0 },
              { label: "Brown Rice", price: 0 },
              { label: "Quinoa", price: 1.5 },
              { label: "Mixed Greens", price: 1.0 },
              { label: "Cauliflower Rice", price: 2.0 },
            ],
          },
          {
            name: "Protein",
            description: "Choose your protein",
            required: true,
            multiSelect: false,
            options: [
              { label: "Fresh Salmon", price: 5.0 },
              { label: "Tuna", price: 5.5 },
              { label: "Shrimp", price: 4.5 },
              { label: "Tofu", price: 3.0 },
              { label: "Chicken", price: 4.0 },
            ],
          },
          {
            name: "Toppings",
            description: "Add as many toppings as you like",
            required: false,
            multiSelect: true,
            options: [
              { label: "Avocado", price: 2.0 },
              { label: "Edamame", price: 1.0 },
              { label: "Mango", price: 1.0 },
              { label: "Cucumber", price: 0.5 },
              { label: "Corn", price: 0.5 },
              { label: "Red Onion", price: 0.5 },
              { label: "Sesame Seeds", price: 0.5 },
              { label: "Nori Strips", price: 0.5 },
              { label: "Crispy Onion", price: 1.0 },
            ],
          },
          {
            name: "Sauce",
            description: "Choose your sauce",
            required: true,
            multiSelect: false,
            options: [
              { label: "Soy Sauce", price: 0 },
              { label: "Ponzu", price: 0 },
              { label: "Spicy Mayo", price: 0.5 },
              { label: "Yuzu Dressing", price: 1.0 },
              { label: "Teriyaki", price: 0 },
            ],
          },
        ],
      });
      byoResult = "created";
    }

    return NextResponse.json({
      ok: true,
      mainCategories: createdMain,
      drinksProducts: drinksProducts.map((product) => product.name),
      dessertsProducts: dessertsProducts.map((product) => product.name),
      buildYourOwnBowl: byoResult,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
