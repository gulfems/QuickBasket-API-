export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    // log the real error for yourself
    console.error(err);

    // only send err.message to the client for 4xx errors
    const message = status >= 500 ? "Internal Server Error" : err.message;

    res.status(status).json({
        error: {
            message,
            status,
        },
    });
};

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: {
            message: "Resource not found",
            status: 404,
        },
    });
};