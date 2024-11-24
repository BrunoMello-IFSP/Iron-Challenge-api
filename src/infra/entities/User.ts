import mongoose, { Schema } from 'mongoose';

import { IUser } from '@/interfaces/IUser';

export interface IUserMongooseSchema
  extends Document,
    IUser,
    Omit<IUser, '_id'> {}

const UserSchema = new Schema(
  {
    name: {
      type: String,      
    },
    cpf: {
      type: String,
      
    },
    birthDate: {
      type: Date,
    },
    sex: {
      type: String,
    },
    phone: {
      type: Number,      
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    address: {
      street: {
        type: String,
      },
      number: {
        type: Number,
      },
      neighborhood: {
        type: String,
      },
      complement: {
        type: String,
      },
      city: {
        type: String,
      },
      uf: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
  token: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
  },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUserMongooseSchema>('users', UserSchema);
