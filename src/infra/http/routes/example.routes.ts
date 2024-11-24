import { Router } from 'express';

import { ExampleController } from '../controller/ExampleController';

const exampleRouter = Router();
const exampleController = new ExampleController();

exampleRouter.get('/', exampleController.index);

export { exampleRouter };
