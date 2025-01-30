import { parseValidationErrors } from "../lib/error-util.js";

const errorHandler = (err, req, res, next) => {
    if (err.isCustom) {
        // Handle custom errors
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }

    if (err.name === "ValidationError") {
        const messages = parseValidationErrors(err);
        return res.status(400).json({
            success: false,
            errors: messages,
        });
    }

    // Handle other errors (e.g., Mongoose errors, generic server errors)
    console.error(err); // Log the error for debugging
    res.status(500).json({
        success: false,
        message: "An internal server error occurred",
    });
};

export default errorHandler;