import { Schema } from "mongoose";
import { IUser } from "./IUser";

interface ICategories{
  _id: Schema.Types.ObjectId;
  name: string;
}

export interface IEvent {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  startDate: Date;
  finishDate: Date;
  ICategories: ICategories[];
  IOrganizer: IUser;
  createdAt: Date;
  updatedAt: Date;
}