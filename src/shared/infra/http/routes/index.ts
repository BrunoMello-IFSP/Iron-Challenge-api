import { Router } from 'express';


import { exampleRouter } from '@/infra/http/routes/example.routes';
import { userRouter } from '@/infra/http/routes/user.routes';


const routes = Router();

routes.use('/example', exampleRouter);
routes.use('/user', userRouter);

//routes.use(authenticateRouter);

export { routes };
