import mongoose from 'mongoose';
import AppError from '@/shared/errors/AppError';
import { IUser } from '@/interfaces/IUser';
import { IUpdateUserDTO } from '@/interfaces/dtos/IUpdateUserDTO';

interface IRequest {
  token: string;
  data: IUpdateUserDTO;
}


export class UpdateUserService {
  public async execute({ token, data }: IRequest): Promise<IUser> {
    const User = mongoose.model<IUser>('users');
    
    const user = await User.findOne({ token });

    if (!user) {
      throw new AppError('User not found', '404', 404);
    }
   
    Object.assign(user, data);
   
    await user.save();

    return user.toObject();
  }
}
