import express from 'express';
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';
import HTTP_STATUS from '~/constants/httpStatus';
import { ErrorEntity, ErrorStatus } from '~/models/errors';

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req);
    const error = validationResult(req)
    if (error.isEmpty()) {
      return next();
    }
    const errorsObject = error.mapped()
    const errorEntity = new ErrorEntity({errors: {}})
    for(const item in errorsObject){
      const {msg} = errorsObject[item]
      if(msg instanceof ErrorStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY){
        return next(msg)
      }
      errorEntity.errors[item] = errorsObject[item]
    }
    
   next(errorEntity)
  };
};

