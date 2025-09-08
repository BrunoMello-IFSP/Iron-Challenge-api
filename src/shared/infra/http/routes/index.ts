import { Router } from 'express';


import { exampleRouter } from '@/infra/http/routes/example.routes';
import { userRouter } from '@/infra/http/routes/user.routes';
import { eventRouter } from '@/infra/http/routes/event.routes';
import { registrationRouter } from '@/infra/http/routes/registration.routes';
import { championshipRouter } from '@/infra/http/routes/championship.routes';


const routes = Router();

routes.use('/example', exampleRouter);
routes.use('/user', userRouter);
routes.use('/event', eventRouter);
routes.use('/registration', registrationRouter);
routes.use('/championship', championshipRouter)

//routes.use(authenticateRouter);

export { routes };
