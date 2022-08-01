const createError = require("http-errors")

function notFoundHandler(req, res, next) {
    next(createError, "Your request content was not found")
}
// default error handler


function errorHandler(err, req, res, next) {
    res.locals.error =
        process.env.NODE_ENV === "development" ? err : { message: err.message };

    res.status(err.status || 500);


    if (res.locals.html) {
        // html response
        res.render("error", {
            title: "Error page",
        });
    } else {
        // json response
        // res.json(res.locals.error);
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        })
    }
}

module.exports = {
    notFoundHandler,
    errorHandler,
};