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
      .sort({ finishDate: 1 });

    return events;
  }
}
