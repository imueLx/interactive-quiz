import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash PIN before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("pin")) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

// Compare PIN
adminSchema.methods.comparePin = function (pin) {
  return bcrypt.compare(pin, this.pin);
};

export default mongoose.models.User || mongoose.model("Admin", adminSchema);
