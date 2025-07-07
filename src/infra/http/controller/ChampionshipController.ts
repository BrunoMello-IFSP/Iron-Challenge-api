
import { Request, Response } from 'express';
import AppError from '@/shared/errors/AppError';
import { container } from 'tsyringe';
import { Types } from 'mongoose';
import { ChampionshipService } from '@/services/ChampionshipService';

export class ChampionshipController {
  public async generate(req: Request, res: Response): Promise<Response> {
    const token = req.headers['authorization'];
    const { eventId, categoryId } = req.query;

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

      if (!eventId || !categoryId) {
        return res.status(400).json({ error: 'eventId and categoryId are required' });
      }


      const championship = container.resolve(ChampionshipService);

      const result = await championship.execute({
        eventId: String(eventId),
        categoryId: String(categoryId),
        token: String(tokenValue),
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('[ChampionshipController] Error:', error);

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const token = req.headers['authorization'];
    const { eventId, categoryId } = req.query;


    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

      if (!eventId || !categoryId) {
        return res.status(400).json({ error: 'eventId and categoryId are required' });
      }


      const championshipService = container.resolve(ChampionshipService);

      const result = await championshipService.listAllEntry({
        eventId: String(eventId),
        categoryId: String(categoryId),
        token: String(tokenValue),
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


}


