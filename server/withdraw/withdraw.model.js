const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    details: { type: Array, default: [] },
    isEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Withdraw", withdrawSchema);
