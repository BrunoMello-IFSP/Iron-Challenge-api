import { IEvent } from "@/interfaces/IEvent";
import mongoose, { Schema } from "mongoose";

export interface IEventMongooseSchema
  extends Document,
  IEvent,
  Omit<IEvent, '_id'> { }

const EventSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    finishDate: {
      type: Date,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'categories',
      },
    ],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export default mongoose.model('events', EventSchema);