import mongoose, { Types } from "mongoose";
import { IEvent } from "../interfaces/IEvent";
import { IUser } from "../interfaces/IUser";
import AppError from "@/shared/errors/AppError";


const EventModel = mongoose.model<IEvent>("events");


interface IDeleteEventParams {
  eventId: string;
  token: string;
}

export class EventDeleteService {
  public async execute({ eventId, token }: IDeleteEventParams): Promise<void> {

    const event = await EventModel.findById(eventId);
    const User = mongoose.model('users');

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    console.log("id do evento", eventId)

    const organizer = await User.findOne({ token });

    console.log("token", token)

    if (!organizer) {
      throw new AppError("User not found", "404", 404);
    }



    if (organizer.token !== token) {
      throw new Error("Acesso negado. Você não é o organizador deste evento.");
    }


    await EventModel.findByIdAndDelete(eventId);

  }
}
