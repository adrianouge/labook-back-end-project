import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "Unauthorized to access information."
    ) { super(401, message) }
}