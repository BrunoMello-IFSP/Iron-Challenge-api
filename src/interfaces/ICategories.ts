import { Schema } from "mongoose";

// interface IEvent{
//   _id: Schema.Types.ObjectId;
//   name: string;
// }

export interface ICategories {
  _id: Schema.Types.ObjectId;
  //event: IEvent[];
  weightRequirement: number;
  createdAt: Date;
  updatedAt: Date;

}