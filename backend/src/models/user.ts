// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import { UserType } from "../shared/types";

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   isAdmin: { type: Boolean, default: false },
//   mobNo: { type: String, required: true },
  
// });

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });

// const User = mongoose.model<UserType>("User", userSchema);

// export default User;
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserType extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobNo?: string;
  isAdmin: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobNo: { type: String },
  isAdmin: { type: Boolean, default: false },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

// Hash password before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<UserType>("User", UserSchema);
