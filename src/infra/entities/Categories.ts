import { ICategories } from "@/interfaces/ICategories";
import mongoose, { Schema } from "mongoose";

export interface ICategoriesMongooseSchema
  extends Document,
  ICategories,
  Omit<ICategories, '_id'> { }

const CategoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  event: {
    _id: {
      type: mongoose.Types.ObjectId,
      ref: 'events',
    },
    name: {
      type: String,
    },
  },
  weightRequirement: {
    type: Number,
    required: true,
  }
},
  { timestamps: true }
);
export default mongoose.model('categories', CategoriesSchema);