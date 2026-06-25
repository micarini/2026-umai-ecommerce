import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // "main" = navegación principal (Bowls, Drinks, Desserts)
    // "tag"  = etiqueta visual en el producto (Vegetarian, Classic, etc.)
    type: {
      type: String,
      enum: ["main", "tag"],
      default: "tag",
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const Category = mongoose.model("Category", categorySchema);

export default Category;
