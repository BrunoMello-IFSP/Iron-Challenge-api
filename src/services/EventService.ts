import { IEvent } from "@/interfaces/IEvent";
import { IUser } from "@/interfaces/IUser";
import AppError from "@/shared/errors/AppError";
import mongoose from "mongoose";

export class EventService {
  public async listActive(token: string) {
    const Event = mongoose.model("events");
    const User = mongoose.model("users");

    const user = await User.findOne({ token });
    if (!user) {
      throw new AppError("User not found", "404", 404);
    }

    const today = new Date();

    const events = await Event.find({
      finishDate: { $gte: today },
    })
      .populate({
        path: "categories",
        select: "name weightRequirement",
      })
      .populate({
        path: "organizer",
        select: "token",
      })
      .sort({ finishDate: 1 });

    const formatted = events.map(event => ({
      _id: event._id,
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      finishDate: event.finishDate,
      categories: event.categories,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,

      owner: event.organizer?.token ?? null,
    }));

    return formatted;
  }
}
