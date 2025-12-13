import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserType } from "../shared/types";

const userSchema = new mongoose.Schema({
  email: { type: String, required: false, unique: true, sparse: true },
  phoneNumber: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  mobNo: { type: String, required: false }, // Keeping for backward compatibility
});

// Ensure either email or phoneNumber is provided
userSchema.pre('save', function(next) {
  if (!this.email && !this.phoneNumber) {
    return next(new Error('Either email or phoneNumber is required'));
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
