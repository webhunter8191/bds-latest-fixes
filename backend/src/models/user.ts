import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserType extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobNo: string;
  isAdmin: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobNo: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Number },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.models.User || mongoose.model<UserType>("User", UserSchema);

export default User;
