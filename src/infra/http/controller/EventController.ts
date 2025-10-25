import { Request, Response } from 'express';
import AppError from '@/shared/errors/AppError';
import { container } from 'tsyringe';
import { CreateEventService } from '@/services/CreateEventService';
import { EventDeleteService } from '@/services/EventDeleteService';


export class EventCreate {
  public async handle(req: Request, res: Response): Promise<Response> {
    const token = req.headers['authorization'];
    const { name, description, startDate, finishDate, categories } = req.body;


    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
      if (!name || !description || !startDate || !finishDate || !categories) {
        throw new AppError('Todos os campos são obrigatórios.', '400', 400);
      }

      // Validação das datas
      if (new Date(startDate) >= new Date(finishDate)) {
        throw new AppError('A data de término deve ser após a data de início.', '400', 400);
      }

      const createEventService = container.resolve(CreateEventService);

      const event = await createEventService.execute({ name, description, startDate, finishDate, categories, token: String(tokenValue) });

      return res.status(201).json({ message: 'Evento criado com sucesso!', event });

    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export class EventDelete {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    // Extrai apenas o token (remove o 'Bearer ')
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

    const eventDeleteService = new EventDeleteService();

    try {
      await eventDeleteService.execute({ eventId: id, token: String(tokenValue) });
      return res.status(200).json({ message: "Evento deletado com sucesso." });

    } catch (error: any) {
      if (error.message === "Evento não encontrado.") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Acesso negado. Você não é o organizador deste evento.") {
        return res.status(403).json({ message: error.message });
      }

      console.error(error);
      return res.status(500).json({ message: "Erro ao deletar evento." });
    }
  }
}