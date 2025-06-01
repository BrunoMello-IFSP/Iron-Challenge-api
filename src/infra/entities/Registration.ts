
import { IRegistration } from "@/interfaces/IRegistration";
import mongoose, { Schema } from "mongoose";

export interface IRegistrationMongooseSchema
  extends Document,
  IRegistration,
  Omit<IRegistration, '_id'> { }

const RegistrationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User  ',
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Categories"
    },
    competitorWeigh: {
      type: Boolean
    },
  },
  { timestamps: true }
)

export default mongoose.model('registrations', RegistrationSchema);