import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';
import HTTP_STATUS from '~/constants/httpStatus';
import { ErrorStatus } from '~/models/errors';

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err).forEach((item) => {
    Object.defineProperty(err, item, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
}