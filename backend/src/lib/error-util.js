export const parseValidationErrors = (error) => {
    if (error.name === "ValidationError") {
        return Object.values(error.errors).map(err => err.message);
    }
    return ["An unknown error occurred."];
};


class CustomErrorWithStatusCode extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.isCustom = true;
        Error.captureStackTrace(this, this.constructor);
    }
}


export class NotFoundError extends CustomErrorWithStatusCode {
    constructor(message) {
        super(message, 404);
    }

    static create(message) {
        return new NotFoundError(message);
    }
}


export class UnauthorizedError extends CustomErrorWithStatusCode {
    constructor(message) {
        super(message, 401);
    }

    static create() {
        return new UnauthorizedError("Unauthorized");
    }

    static createWithMessage(message) {
        return new UnauthorizedError(message);
    }
}


export class InvalidDataError extends CustomErrorWithStatusCode {
    constructor(message) {
        super(message, 400);
    }
}