import mongoose from 'mongoose';

import AppError from '@/shared/errors/AppError';

import { IUser } from '@/interfaces/IUser';
import { ICreateUserDTO } from '@/interfaces/dtos/ICreateUserDTO';

export class CreateUserService {
  public async execute({
    token
  }: ICreateUserDTO): Promise<void> {
    const User = mongoose.model<IUser>('users');


    console.log("token user", token);


    const userExists = await User.findOne({ token });

    if (userExists) {
      throw new AppError('User already exists', '409', 409);
    }

    const user = new User({
      token,
    });

    await user.save();
  }
}
