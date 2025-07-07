import { IChampionship } from "@/infra/entities/Championship";
import AppError from "@/shared/errors/AppError";
import mongoose, { Types } from "mongoose";


interface IRequest {
  eventId: string;
  categoryId: string;
  token: string;
}

export class ChampionshipService {
  public async execute({ eventId, categoryId, token }: IRequest): Promise<IChampionship[]> {
    const User = mongoose.model('users');
    const Event = mongoose.model('events');
    const Registration = mongoose.model('registrations');
    const Championship = mongoose.model<IChampionship>('championships');

    const user = await User.findOne({ token });

    if (!user) {
      throw new AppError('User not found', '404', 404);
    }

    const event = await Event.findOne({ _id: eventId, organizer: user._id });

    if (!event) {
      throw new AppError('You are not the organizer of this event', '403', 403);
    }

    const existingChampionships = await Championship.find({
      eventId: new Types.ObjectId(eventId),
      categoryId: new Types.ObjectId(categoryId),
    });

    if (existingChampionships.length > 0) {
      return Championship.find({
        eventId: new Types.ObjectId(eventId),
        categoryId: new Types.ObjectId(categoryId),
      }).populate('userId', 'name').exec();
    }


    const registrations = await Registration.find({
      eventId: new Types.ObjectId(eventId),
      categoryId: new Types.ObjectId(categoryId),
    });

    if (registrations.length === 0) {
      throw new AppError('No registrations found for this event and category', '404', 404);
    }


    const shuffled = registrations.sort(() => Math.random() - 0.5);

    const championshipEntries = shuffled.map((registration, index) => ({
      userId: registration.userId,
      eventId: new Types.ObjectId(eventId),
      categoryId: new Types.ObjectId(categoryId),
      entryOrder: index + 1,
      attended: null,
      position: null,
    }));

    const created = await Championship.insertMany(championshipEntries);

    return Championship.find({
      _id: { $in: created.map(c => c._id) },
    }).populate('userId', 'name').exec();
  }

  public async listAllEntry({
    eventId,
    categoryId,
    token,
  }: IRequest): Promise<IChampionship[]> {
    const User = mongoose.model('users');
    const Event = mongoose.model('events');
    const Championship = mongoose.model<IChampionship>('championships');

    const user = await User.findOne({ token });

    if (!user) {
      throw new AppError('User not found', '404', 404);
    }

    const event = await Event.findOne({ _id: eventId, organizer: user._id });



    if (!event) {
      throw new AppError('You are not the organizer of this event', '403', 403);
    }

    const notAttended = await Championship.find({
      eventId: String(eventId),
      categoryId: new Types.ObjectId(categoryId),
      attended: null,
    }).populate('userId', 'name').exec();

    console.log(notAttended)

    return notAttended;
  }
}