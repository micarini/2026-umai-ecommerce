import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    // Customization options for sushi bowls
    customizations: [
      {
        name: {
          type: String,
          required: true,
          // e.g., "Base", "Protein", "Vegetables", "Toppings"
        },
        description: {
          type: String,
          default: "",
        },
        required: {
          type: Boolean,
          default: true,
        },
        options: [
          {
            label: {
              type: String,
              required: true,
              // e.g., "White Rice", "Brown Rice", "Salmon"
            },
            price: {
              type: Number,
              default: 0,
              // Additional price for this option
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Product && !mongoose.models.Product.schema.path("categories")) {
  mongoose.deleteModel("Product");
}

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
