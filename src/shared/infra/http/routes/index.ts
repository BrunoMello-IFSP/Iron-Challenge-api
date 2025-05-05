import { Router } from 'express';


import { exampleRouter } from '@/infra/http/routes/example.routes';
import { userRouter } from '@/infra/http/routes/user.routes';
import { eventRouter } from '@/infra/http/routes/event.routes';


const routes = Router();

routes.use('/example', exampleRouter);
routes.use('/user', userRouter);
routes.use('/event', eventRouter);

//routes.use(authenticateRouter);

export { routes };
