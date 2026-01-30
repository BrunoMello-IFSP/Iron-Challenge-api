import { RegistrationService } from '@/services/RegistrationService';
import AppError from '@/shared/errors/AppError';
import { Request, Response } from 'express';
import { Schema, Types } from 'mongoose';

export class RegistrationController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const token = req.headers['authorization']
    const data = req.body;

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

      const createRegistration = new RegistrationService();

      const registration = await createRegistration.execute({ token: String(tokenValue), data });

      return res.status(201).json(registration);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  public async update(req: Request, res: Response): Promise<Response> {
    const token = req.headers['authorization'];
    const { registrationId } = req.params;
    const data = req.body;

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

      const registrationService = new RegistrationService();

      const updatedRegistration = await registrationService.update({
        token: String(tokenValue),
        registrationId,
        data,
      });

      return res.status(200).json(updatedRegistration);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // public async list(req: Request, res: Response): Promise<Response> {
  //   const token = req.headers['authorization'];
  //   const { eventId, categoryId } = req.query;

  //   try {
  //     if (!token) {
  //       return res.status(400).json({ error: 'Token is required' });
  //     }

  //     const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

  //     const registrationService = new RegistrationService();


  //     const registrations = await registrationService.list({
  //       token: String(tokenValue),
  //       data: {
  //         eventId: eventId ? new Types.ObjectId(String(eventId)) : undefined,
  //         categoryId: categoryId ? new Types.ObjectId(String(categoryId)) : undefined,
  //       },
  //     });

  //     return res.status(200).json(registrations);
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       return res.status(error.statusCode).json({ error: error.message });
  //     }

  //     return res.status(500).json({ error: 'Internal Server Error' });
  //   }

  // }
  public async listByOrganizer(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization!;

    const service = new RegistrationService();

    const data = await service.listByOrganizer({
      token: token.startsWith('Bearer ') ? token.slice(7) : token,
    });

    return res.json(data);
  }

  public async listMyRegistrations(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization!;

    const service = new RegistrationService();

    const data = await service.listByUser({
      token: token.startsWith('Bearer ') ? token.slice(7) : token,
    });

    return res.json(data);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const token = req.headers['authorization'];
    const { id } = req.params;

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

      const registrationService = new RegistrationService();

      await registrationService.delete({
        token: String(tokenValue),
        registrationId: new Types.ObjectId(id),
      });

      return res.status(200).json({ message: 'Registration deleted successfully.' });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}