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
      buildYourOwnBowl: byoResult,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
