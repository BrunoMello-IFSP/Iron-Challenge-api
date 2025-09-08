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
    token
  }: ICreateEventDTO): Promise<IEvent> {
    const EventModel = mongoose.model<IEvent>('events');
    const User = mongoose.model<IUser>('users');

    const eventExists = await EventModel.findOne({ name, startDate, finishDate });

    const user = await User.findOne({ token });

    if (eventExists) {
      throw new AppError('Event already exists', '409', 409);
    }

    const createdCategories = await Categories.insertMany(
      categories.map((category: { name: string; weightRequirement: number }) => ({
        name: category.name,
        weightRequirement: category.weightRequirement,
      }))
    );

    const event = new EventModel({
      name,
      description,
      organizer: user?._id,
      startDate,
      finishDate,
      categories: createdCategories.map((category) => category._id),
    });

    await event.save();

    return event;
  }
}
