import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }

});

export default mongoose.model("UserDetail", userSchema);
