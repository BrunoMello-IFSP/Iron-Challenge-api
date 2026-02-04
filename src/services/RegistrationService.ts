import { IRegistrationDTO } from "@/interfaces/dtos/IRegistrationDTO";
import { IRegistrationListResponseDTO } from "@/interfaces/dtos/IRegistrationListResponseDTO";
import { IEvent } from "@/interfaces/IEvent";
import { IRegistration } from "@/interfaces/IRegistration";
import { IUser } from "@/interfaces/IUser";
import AppError from "@/shared/errors/AppError";
import { response } from "express";
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

interface IDeleteRegistration {
  token: string,
  registrationId: Types.ObjectId

}
export class RegistrationService {
  public async execute({ token, data }: IRequest): Promise<IRegistrationDTO> {
    const Registration = mongoose.model<IRegistration>('registrations')
    const User = mongoose.model<IUser>('users');

    console.log("token")

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

  // public async list({ token, data }: IListRequest): Promise<IRegistrationListResponseDTO[]> {
  //   const Registration = mongoose.model<IRegistration>('registrations');
  //   const User = mongoose.model<IUser>('users');
  //   const Event = mongoose.model<IEvent>('events');

  //   const user = await User.findOne({ token });

  //   if (!user) {
  //     throw new AppError('User not found', '404', 404);
  //   }

  //   const query: any = {};

  //   /* ================= ADMIN ================= */
  //   if (user.role === 'admin') {
  //     const eventsCreated = await Event.find(
  //       { organizer: user._id },
  //       { _id: 1 }
  //     );

  //     const eventIds = eventsCreated.map(event => event._id);

  //     query.$or = [
  //       // inscrições que o admin FEZ (competidor)
  //       { userId: user._id },

  //       // inscrições dos eventos que ele ORGANIZA
  //       eventIds.length > 0
  //         ? { eventId: { $in: eventIds } }
  //         : null,
  //     ].filter(Boolean);

  //     // filtros opcionais
  //     if (data.eventId) {
  //       query.eventId = data.eventId;
  //     }

  //     if (data.categoryId) {
  //       query.categoryId = data.categoryId;
  //     }

  //     /* ================= USER COMUM ================= */
  //   } else {
  //     query.userId = user._id;

  //     if (data.eventId) {
  //       query.eventId = data.eventId;
  //     }

  //     if (data.categoryId) {
  //       query.categoryId = data.categoryId;
  //     }
  //   }

  //   const registrations = await Registration
  //     .find(query)
  //     .populate({
  //       path: 'eventId',
  //       select: 'name startDate finishDate',
  //     })
  //     .populate({
  //       path: 'categoryId',
  //       select: 'name weightRequirement',
  //     })
  //     .lean<IRegistration[]>();

  //   const formatted: IRegistrationListResponseDTO[] = registrations.map(reg => ({
  //     _id: reg._id as unknown as Types.ObjectId,
  //     userId: reg.userId as unknown as Types.ObjectId,
  //     competitorWeight: Number(reg.competitorWeight),
  //     createdAt: reg.createdAt,
  //     updatedAt: reg.updatedAt,
  //     event: reg.eventId as any,
  //     category: reg.categoryId as any,
  //   }));

  //   return formatted;
  // }

  public async listByOrganizer({
    token, categoryId,
  }: { token: string, categoryId: string }): Promise<IRegistrationListResponseDTO[]> {

    const Registration = mongoose.model<IRegistration>('registrations');
    const User = mongoose.model<IUser>('users');
    const Event = mongoose.model<IEvent>('events');

    const user = await User.findOne({ token });

    if (!user || user.role !== 'admin') {
      throw new AppError('Not authorized', '403', 403);
    }

    const events = await Event.find(
      { organizer: user._id },
      { _id: 1, categories: 1 }
    )
      .populate({
        path: 'categories.categoryId',
        select: 'name weightRequirement',
      })
      .lean<IEvent[]>();

    const eventCategoryMap = new Map<string, boolean>();

    events.forEach(event => {
      event.categories.forEach(cat => {
        if (!cat.categoryId) return;

        const catId =
          typeof cat.categoryId === 'object'
            ? (cat.categoryId as any)._id
            : cat.categoryId;

        eventCategoryMap.set(catId.toString(), cat.started);
      });
    });

    const eventIds = events.map(e => e._id);

    if (eventIds.length === 0) return [];

    const registrations = await Registration.find({
      eventId: { $in: eventIds },
      categoryId: new Types.ObjectId(categoryId),
    })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .populate({
        path: 'eventId',
        select: 'name startDate finishDate',
      })
      .populate({
        path: 'categoryId',
        select: 'name weightRequirement',
      })
      .lean();



    return registrations
      .filter(reg => reg.categoryId)
      .map(reg => {
        const category = reg.categoryId as any;

        return {
          _id: reg._id as unknown as Types.ObjectId,
          userId: (reg.userId as any)._id,
          competitorName: (reg.userId as any).name,
          competitorWeight: Number(reg.competitorWeight),
          createdAt: reg.createdAt,
          updatedAt: reg.updatedAt,
          event: reg.eventId as any,
          category: {
            _id: category._id,
            name: category.name,
            weightRequirement: category.weightRequirement,
            started:
              eventCategoryMap.get(category._id.toString()) ?? false,
          },
        };
      });
  }

  public async listByUser({
    token,
  }: { token: string }): Promise<IRegistrationListResponseDTO[]> {

    const Registration = mongoose.model<IRegistration>('registrations');
    const User = mongoose.model<IUser>('users');

    const user = await User.findOne({ token });

    if (!user) {
      throw new AppError('User not found', '404', 404);
    }

    const registrations = await Registration.find({
      userId: user._id,
    })
      .populate({
        path: 'eventId',
        select: 'name startDate finishDate',
      })
      .populate({
        path: 'categoryId',
        select: 'name weightRequirement',
      })
      .lean<IRegistration[]>();


    const formatted: IRegistrationListResponseDTO[] = registrations.map(reg => ({
      _id: reg._id as unknown as Types.ObjectId,
      userId: reg.userId as unknown as Types.ObjectId,
      competitorWeight: Number(reg.competitorWeight),
      createdAt: reg.createdAt,
      updatedAt: reg.updatedAt,
      event: reg.eventId as any,
      category: reg.categoryId as any,
    }));

    return (formatted);
  }


  public async delete({ token, registrationId }: IDeleteRegistration): Promise<void> {
    const Registration = mongoose.model<IRegistration>('registrations');
    const User = mongoose.model<IUser>('users');

    const userExists = await User.findOne({ token });
    if (!userExists) {
      throw new AppError('User not found', '404', 404);
    }

    const userRegistration = await Registration.findById(registrationId);
    if (!userRegistration) {
      throw new AppError('Registration not found', '404', 404);
    }

    if (String(userRegistration.userId) !== String(userExists._id)) {
      throw new AppError('Not Permission', '403', 403);
    }

    await Registration.deleteOne({ _id: registrationId });
  }

}


