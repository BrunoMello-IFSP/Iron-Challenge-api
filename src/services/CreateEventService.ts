import mongoose from 'mongoose';
import AppError from '@/shared/errors/AppError';
import { IEvent } from '@/interfaces/IEvent';

import Categories from '@/infra/entities/Categories';
import Event from '@/infra/entities/Event';
import { ICreateEventDTO } from '@/interfaces/dtos/ICreateEventDTO';

export class CreateEventService {
  public async execute({
    name,
    description,
    startDate,
    finishDate,
    categories,
  }: ICreateEventDTO): Promise<IEvent> {
    const EventModel = mongoose.model<IEvent>('events');

    const eventExists = await EventModel.findOne({ name, startDate, finishDate });

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
      startDate,
      finishDate,
      categories: createdCategories.map((category) => category._id),
    });

    await event.save();

    return event;
  }
}
