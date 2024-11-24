import AppError from "@/shared/errors/AppError";
import mongoose from "mongoose";

interface IRequest {
  token: string;
}

export class GetOneUserService {
  public async execute({token}: IRequest): Promise<void> {
    const User = mongoose.model('users');

    const userExists =  await User.findOne({ token });

    if (!userExists) {      
      throw new AppError("User not found", "404", 404);
    }
 
    return;    
  }
}