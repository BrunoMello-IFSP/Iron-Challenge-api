import { NextFunction, Request, Response } from 'express';

import AppError from '@/shared/errors/AppError';

interface IAuthenticationHubOptions {
  authMiddlewares: ((
    request: Request,
    response: Response,
    next: NextFunction,
  ) => void)[];
}

export function authenticationHub(
  request: Request,
  response: Response,
  next: NextFunction,
  options: IAuthenticationHubOptions,
): void {
  const { authMiddlewares } = options;

  let isAuthenticated = false;
  let nextFunctionReturn: void;

  for (const authMiddleware of authMiddlewares) {
    try {
      nextFunctionReturn = authMiddleware(request, response, next);
      isAuthenticated = true;
      break;
    } catch (error) {
      continue;
    }
  }

  if (!isAuthenticated) {
    throw new AppError('Authentication failed.');
  }

  return nextFunctionReturn;
}
