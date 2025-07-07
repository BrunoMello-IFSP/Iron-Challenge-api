import { Schema } from 'mongoose';

interface IAddress {
  street: string;
  number: string;
  zipCode: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  cpf: string;
  birthDate: Date;
  sex: string;
  phone: string;
  email: string;
  address: IAddress;
  token: string;
  role: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
