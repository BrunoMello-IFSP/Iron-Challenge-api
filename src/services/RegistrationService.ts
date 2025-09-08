import { IRegistrationDTO } from "@/interfaces/dtos/IRegistrationDTO";
import { IEvent } from "@/interfaces/IEvent";
import { IRegistration } from "@/interfaces/IRegistration";
import { IUser } from "@/interfaces/IUser";
import AppError from "@/shared/errors/AppError";
import mongoose, { Schema, Types } from "mongoose";

interface IRequest {
  token: string;
  data: IRegistrationDTO;
}


interface IUpdateRequest {
  token: string;
  data: IRegistrationDTO;
  registrationId: string;
}

interface IListRequest {
  token: string;
  data: {
    eventId?: Types.ObjectId;
    categoryId?: Types.ObjectId;
  };
}
export class RegistrationService {
  public async execute({ token, data }: IRequest): Promise<IRegistrationDTO> {
    const Registration = mongoose.model<IRegistration>('registrations')
    const User = mongoose.model<IUser>('users');

    const userExists = await User.findOne({ token });

    if (!userExists) {
      throw new AppError('User not found', '404', 404);
    }

    const alreadyRegistered = await Registration.findOne({
      userId: userExists._id,
      eventId: data.eventId,
      categoryId: data.categoryId,
    });

    if (alreadyRegistered) {
      throw new AppError('User already registered in this event and category', '409', 409);
    }
    const registration = new Registration({
      userId: userExists._id,
      eventId: data.eventId,
      categoryId: data.categoryId,
      competitorWeight: data.competitorWeight,
    });

    await registration.save();

    return registration.toObject();
  }



  public async update({ token, data, registrationId }: IUpdateRequest): Promise<IRegistrationDTO> {
    const Registration = mongoose.model<IRegistration>('registrations');
    const User = mongoose.model<IUser>('users');

    const userExists = await User.findOne({ token });

    if (!userExists) {
      throw new AppError('User not found', '404', 404);
    }

    if (userExists.role != 'admin') {
      throw new AppError('User not permission', '403', 403);
    }

    const registration = await Registration.findById(registrationId);

    if (!registration) {
      throw new AppError('Registration not found', '404', 404);
    }

    // Atualiza apenas os campos enviados
    if (data.competitorWeight !== undefined) {
      registration.competitorWeight = data.competitorWeight;
    }

    if (data.categoryId && registration.categoryId !== data.categoryId) {
      registration.categoryId = data.categoryId;
    }
    //console.log(data.competitorWeight)
    await registration.save();

    return registration.toObject();
  }

  public async list({ token, data }: IListRequest): Promise<any[]> {
    const Registration = mongoose.model<IRegistration>('registrations');
    const User = mongoose.model<IUser>('users');
    const Event = mongoose.model<IEvent>('events');

    const user = await User.findOne({ token });

    if (!user) {
      throw new AppError('User not found', '404', 404);
    }

    const query: any = {};

    if (user.role === 'admin') {
      // Buscar eventos que o admin criou
      const eventsCreated = await Event.find({ organizer: user._id }, { _id: 1 });
      const eventIds = eventsCreated.map(event => event._id);

      if (eventIds.length === 0) {
        return [];
      }

      query.eventId = { $in: eventIds };

      if (data.eventId) {

        const isAllowed = eventIds.some(id => id.toString() === data.eventId?.toString());
        if (!isAllowed) return [];
        query.eventId = data.eventId;
      }

      if (data.categoryId) {
        query.categoryId = data.categoryId;
      }

    } else {
      query.userId = user._id;

      if (data.eventId) {
        query.eventId = data.eventId;
      }

      if (data.categoryId) {
        query.categoryId = data.categoryId;
      }
    }

    const registrations = await Registration.find(query).lean();

    return registrations;
  }

}