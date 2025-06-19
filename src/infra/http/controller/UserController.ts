import { Request, Response } from 'express';
import { CreateUserService } from '@/services/CreateUserService';
import AppError from '@/shared/errors/AppError';
import { container } from 'tsyringe';
import { GetOneUserService } from '@/services/GetOneUserService';
import { UpdateUserService } from '@/services/UpdateUserService';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';

export class UserController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.body;


      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const createUserService = new CreateUserService();


      await createUserService.execute({ token });

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { token } = req.body
    try {

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const getOneUserService = container.resolve(GetOneUserService)

      await getOneUserService.execute({ token: String(token) });

      return res.status(200).json({ message: 'User exists' });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async update(request: Request, res: Response): Promise<Response> {
    const token = request.headers['authorization'];
    const data = request.body;
    const User = mongoose.model<IUser>('users');
    try {

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const user = await User.findOne({ token });


      if (data.email && data.email !== user?.email) {
        const emailExists = await User.findOne({ email: data.email });

        if (emailExists) {
          throw new AppError('Email is already in use', '409', 409);
        }
      }


      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

      const updateUserService = new UpdateUserService();

      const updatedUser = await updateUserService.execute({ token: String(tokenValue), data });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('[UpdateUserController] ERRO:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}


