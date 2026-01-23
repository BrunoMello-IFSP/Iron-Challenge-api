import mongoose from 'mongoose';
import AppError from '@/shared/errors/AppError';
import { IEvent } from '@/interfaces/IEvent';

import Categories from '@/infra/entities/Categories';
import Event from '@/infra/entities/Event';
import { ICreateEventDTO } from '@/interfaces/dtos/ICreateEventDTO';
import { IUser } from '@/interfaces/IUser';

export class CreateEventService {
  public async execute({
    name,
    description,
    startDate,
    finishDate,
    categories,
    token,
  }: ICreateEventDTO): Promise<IEvent> {
    const EventModel = mongoose.model<IEvent>("events");
    const CategoryModel = mongoose.model("categories");
    const UserModel = mongoose.model<IUser>("users");

    const eventExists = await EventModel.findOne({
      name,
      startDate,
      finishDate,
    });

    if (eventExists) {
      throw new AppError("Event already exists", "409", 409);
    }

    const user = await UserModel.findOne({ token });
    if (!user) {
      throw new AppError("User not found", "404", 404);
    }


    const event = await EventModel.create({
      name,
      description,
      startDate,
      finishDate,
      organizer: user._id,
      categories: [],
    });


    const createdCategories = await CategoryModel.insertMany(
      categories.map((category) => ({
        name: category.name,
        weightRequirement: category.weightRequirement,
      }))
    );


    await EventModel.findByIdAndUpdate(event._id, {
      $push: {
        categories: {
          $each: createdCategories.map((c) => c._id),
        },
      },
    });


    const updatedEvent = await EventModel.findById(event._id).populate({
      path: "categories",
      select: "name weightRequirement",
    });

    return updatedEvent as IEvent;
  }
}
