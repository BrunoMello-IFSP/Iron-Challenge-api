import { Schema, Types } from "mongoose";
import { IUser } from "./IUser";

interface ICategories {
  categoryId: Schema.Types.ObjectId;
  name: string;
  started: boolean;

}

export interface IEvent {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  startDate: Date;
  finishDate: Date;
  categories: ICategories[];
  organizer: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}