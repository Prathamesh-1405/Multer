import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserDetail extends Document {
  _id: string;
  email: string;
  contact: string;
  name: string;
}

const UserDetailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    contact: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
     owner: { 
      type: Schema.Types.ObjectId,
      ref: "User", required: true 
    },

  },
  { timestamps: true }
);

export default models.UserDetail || mongoose.model<IUserDetail>("UserDetail", UserDetailSchema);
