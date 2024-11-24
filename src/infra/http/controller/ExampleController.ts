import { Request, Response } from 'express';

import { ExampleService } from '@/services/ExampleService';

export class ExampleController {
  async index(req: Request, res: Response): Promise<Response> {
    const exampleService = new ExampleService();

    const example = await exampleService.execute();

    return res.json(example);
  }
}
