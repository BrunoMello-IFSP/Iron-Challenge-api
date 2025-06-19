import { Schema } from "mongoose";

export interface IRegistrationDTO {
  userId: Schema.Types.ObjectId;
  eventId?: Schema.Types.ObjectId;
  categoryId?: Schema.Types.ObjectId;
  competitorWeight: Number;
}