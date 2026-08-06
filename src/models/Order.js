import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    customizations: { type: mongoose.Schema.Types.Mixed, default: {} },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    status: {
      type: String,
      enum: ["Active", "Closed", "Shipped", "Canceled"],
      default: "Active",
    },
    user: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    contact: {
      address: { type: String, default: "" },
      notes: { type: String, default: "" },
      shippingMethod: {
        type: String,
        enum: ["delivery", "pickup"],
        default: "delivery",
      },
    },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const Order = mongoose.model("Order", orderSchema);

export default Order;
