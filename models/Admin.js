import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("pin")) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

adminSchema.methods.comparePin = async function (pin) {
  return bcrypt.compare(pin, this.pin);
};

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
