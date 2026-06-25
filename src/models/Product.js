import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    required: { type: Boolean, default: true },
    multiSelect: { type: Boolean, default: false },
    options: [optionSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: "", trim: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    // "regular" = bowl armado con precio fijo
    // "custom"  = Build Your Own Bowl, precio calculado desde customizations
    type: {
      type: String,
      enum: ["regular", "custom"],
      default: "regular",
    },
    customizations: [customizationSchema],
  },
  { timestamps: true }
);

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = mongoose.model("Product", productSchema);

export default Product;
