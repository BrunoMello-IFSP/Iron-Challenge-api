import mongoose, { Schema, Document } from 'mongoose';

export interface IChampionship extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  entryOrder: number;
  attended: boolean | null;
  repetition: number;
  position?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const ChampionshipSchema = new Schema<IChampionship>(
  {
    _id: Schema.Types.ObjectId,
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    entryOrder: { type: Number, required: true },
    attended: { type: Boolean, default: null },
    repetition: { type: Number, default: null },
    position: { type: Number, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IChampionship>('championships', ChampionshipSchema);