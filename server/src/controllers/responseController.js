const errorResponse = (res, {statusCode =500, message = "Internel Server Error"}) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

const successResponse = (res, {statusCode =200, message = "Success", playload = {}}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        playload
    });
};


module.exports = {errorResponse, successResponse};