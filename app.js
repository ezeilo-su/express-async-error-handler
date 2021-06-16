const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/globalErrorHandler');

const app = express();

// The first middleware to add before route middlewares
app.use(express.json());

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// The last middlewares in the middleware stack:
// To handle all error due to undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);