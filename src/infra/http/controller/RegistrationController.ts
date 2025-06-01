import AppError from '@/shared/errors/AppError';
import { Request, Response } from 'express';

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
}