import { Schema } from "mongoose";

export interface IRegistration {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  competitorWeigh: boolean;
  createdAt: Date;
  updatedAt: Date;
}