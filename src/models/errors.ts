import HTTP_STATUS from "~/constants/httpStatus"
import { USER_VALID_MESSAGES } from "~/constants/messages"

type ErrorsType = Record<string,{
    msg: string
    [key: string]: any
}>
export class ErrorStatus {
    message: string
    status: number
    constructor({message, status}: {message: string, status: number }){
        this.message = message
        this.status = status
    }
}
export class ErrorEntity extends ErrorStatus{
    errors: ErrorsType
    constructor({message = USER_VALID_MESSAGES.VALIDATION_ERROR, errors}: {message?: string, errors: ErrorsType}){
        super({message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY})
        this.errors = errors
    }
}