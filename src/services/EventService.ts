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
        path: "categories.categoryId",
        select: "name weightRequirement",
      })
      .populate({
        path: "organizer",
        select: "token",
      })
      .sort({ finishDate: 1 })
      .lean();

    return events.map(event => ({
      _id: event._id,
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      finishDate: event.finishDate,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,

      categories: event.categories.map((cat: any) => ({
        categoryId: cat.categoryId?._id,
        name: cat.categoryId?.name,
        weightRequirement: cat.categoryId?.weightRequirement,
        started: cat.started,
      })),

      owner: event.organizer?.token ?? null,
    }));

  }


  public async listByOrganizer(token: string) {
    const User = mongoose.model("users");
    const Event = mongoose.model("events");

    const user = await User.findOne({ token });
    if (!user) {
      throw new AppError("User not found", "404", 404);
    }

    const events = await Event.find({
      organizer: user._id,
    })
      .populate({
        path: "categories.categoryId",
        select: "name weightRequirement",
      })
      .sort({ startDate: 1 })
      .lean();

    return events.map((event: any) => ({
      ...event,
      categories: event.categories.map((cat: any) => ({
        categoryId: cat.categoryId?._id,
        name: cat.categoryId?.name,
        weightRequirement: cat.categoryId?.weightRequirement,
        started: cat.started,
      })),
    }));
  }
}

