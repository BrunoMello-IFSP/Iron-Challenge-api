import { Router } from "express";
import { UserController } from "../controller/UserController";
import { celebrate, Joi, Segments } from "celebrate";
import { updateUserValidation } from "@/shared/infra/http/middlewares/validations/routes/user/updateUserValidation";

const userRouter = Router();
const userController = new UserController();


userRouter.post(
  '/', 
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),       
    },
  }),
  userController.handle,
);

userRouter.get(
  '/', 
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),       
    },
  }),
  userController.index,
)

userRouter.put(
  '/',
  celebrate(updateUserValidation),
  userController.update,
);

export { userRouter }