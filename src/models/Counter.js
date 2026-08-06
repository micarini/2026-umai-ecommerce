import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 999 },
});

if (mongoose.models.Counter) {
  delete mongoose.models.Counter;
}

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
