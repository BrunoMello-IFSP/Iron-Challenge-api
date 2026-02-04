import { Types } from 'mongoose';

export interface IRegistrationListResponseDTO {

  _id: Types.ObjectId;
  userId: Types.ObjectId;
  competitorWeight: number;
  createdAt: Date;
  updatedAt: Date;

  event: {
    _id: Types.ObjectId;
    name: string;
    startDate: Date;
    finishDate: Date;
  };

  category: {
    _id: Types.ObjectId;
    name: string;
    weightRequirement: number;
    started: boolean;
  };
}
