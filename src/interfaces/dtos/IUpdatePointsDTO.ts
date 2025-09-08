import { Schema } from "mongoose";

export interface IUpdatePointsDTO {
  id: string;
  attended?: boolean;
  eventId: string;
  repetition?: number;
  token: string;
}