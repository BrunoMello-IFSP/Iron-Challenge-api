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
        _id: false,
        categoryId: {
          type: Schema.Types.ObjectId,
          ref: 'categories',
          required: true,
        },
        started: {
          type: Boolean,
          default: false,
        },
      },
    ],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
)

export default mongoose.model('events', EventSchema);