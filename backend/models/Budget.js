const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    monthlyLimit: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    month: {
      type: String,
      default: "all",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
