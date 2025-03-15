import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 5, max: 12 },
  pin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash PIN before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("pin")) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

// Compare PIN
userSchema.methods.comparePin = function (pin) {
  return bcrypt.compare(pin, this.pin);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
