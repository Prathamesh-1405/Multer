import mongoose, {Document, Schema} from "mongoose";

export interface IFile extends Document{
  filename: string,
  path : string
}

const fileSchema= new Schema<IFile>({
   filename: { type: String, required: true },
   path: {type: String, required: true},

})

export default mongoose.model<IFile>("File", fileSchema)