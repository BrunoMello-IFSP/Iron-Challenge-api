import Championship, { IChampionship } from "@/infra/entities/Championship";
import { IGetResultDTO } from "@/interfaces/dtos/IGetResultDTO";
import { IUpdatePointsDTO } from "@/interfaces/dtos/IUpdatePointsDTO";
import AppError from "@/shared/errors/AppError";
import mongoose, { Types } from "mongoose";
import { WebSocketService } from "./WebSocketService";


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

  public async updatePoints({
    id,
    attended,
    repetition,
    token,
    eventId,
    categoryId,
  }: IUpdatePointsDTO & { categoryId: string }) {
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

    const championship = await Championship.findById(id);
    if (!championship) {
      throw new AppError('Championship not found', '404', 404);
    }

    if (attended !== undefined) {
      championship.attended = attended;
    }
    if (repetition !== undefined) {
      championship.repetition = repetition;
    }

    await championship.save();

    //Recalcular resultado atualizado
    const result = await this.getResult({ eventId, categoryId });

    // Emitir atualização em tempo real via socket
    WebSocketService.emitRankingUpdate(result);

    return result;
  }


  public async getResult({ eventId, categoryId }: IGetResultDTO) {


    const User = mongoose.model('users');
    const Event = mongoose.model('events');
    const Championship = mongoose.model<IChampionship>('championships');

    const results = await Championship.find({
      eventId,
      categoryId,
      attended: true,
    }).populate('userId', 'name')
      .lean();

    if (!results.length) {
      return {
        eventId,
        categoryId,
        results: [],
      };
    }

    // 2. Ordenar por repetition desc (maior repetição primeiro)
    const sorted = results.sort((a: { repetition: any; }, b: { repetition: any; }) => (b.repetition ?? 0) - (a.repetition ?? 0));

    // 3. Mapear para adicionar posição virtual
    const withPosition = sorted.map((r: any, index: number) => ({
      userId: r.userId._id,
      name: r.userId.name,
      repetition: r.repetition,
      attended: r.attended,
      position: index + 1,
    }));
    return {
      eventId,
      categoryId,
      results: withPosition,
    };
  }

  public async finalizeChampionship({ eventId, categoryId }: IGetResultDTO) {
    const Championship = mongoose.model<IChampionship>('championships');

    // verificar se nao tem pendencias
    const championshipNotInsert = await Championship.find({
      eventId,
      categoryId,
      attended: null,
    })


    if (championshipNotInsert.length > 0) {
      throw new AppError('There are pending entries, cannot generate results.', '403', 403);
    }


    // 1. Buscar apenas os competidores que participaram
    const results = await Championship.find({
      eventId,
      categoryId,
      attended: true,
    })
      .populate('userId', 'name')
      .lean();

    if (!results.length) {
      return {
        eventId,
        categoryId,
        results: [],
      };
    }

    // 2. Ordenar pela maior repetição
    const sorted = results.sort(
      (a, b) => (b.repetition ?? 0) - (a.repetition ?? 0),
    );

    // 3. Mapear e salvar a posição no banco
    const withPosition = await Promise.all(
      sorted.map(async (r, index) => {
        const user = r.userId as unknown as { _id: string; name: string };

        // Atualiza o campo `position` no documento
        await Championship.updateOne(
          { _id: r._id },
          { $set: { position: index + 1 } },
        );

        return {
          userId: user._id,
          name: user.name,
          repetition: r.repetition,
          attended: r.attended,
          position: index + 1,
        };
      }),
    );


    return {
      eventId,
      categoryId,
      results: withPosition,
    };
  }
}