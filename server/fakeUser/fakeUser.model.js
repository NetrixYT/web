const mongoose = require("mongoose");

const fakeUserSchema = new mongoose.Schema(
  {
    username: { type: String, default: "George Orwell" },
    uniqueId: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("fakeUser", fakeUserSchema);
