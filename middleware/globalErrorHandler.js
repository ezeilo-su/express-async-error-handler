const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  // We can RegEx to find the text between quotes, based on this error type object
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

const handleValidatorErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const sendErrorDev = (err, res)=> {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Only send operational errors to the client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  // Do not send programming errors or leak details to the client
  } else {
    // Log the error and send a generic message
    console.error('ERROR: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something broke!'
    })
  }
};



module.exports = (err, req, res, next) => {
  
  err.status ||= 'error';
  err.statusCode ||= 500;

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);

  } else if(process.env.NODE_ENV === 'production') {
    
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);

    if (err.name === 'MongoError' && err.code === 11000)
      error = handleDuplicateFieldDB(error);

    if (err.name === 'ValidatorError')
      error = handleValidatorErrorDB(error);

    sendErrorProd(error, res);
  }
};

// Three (3) error types that can occur in Mongoose need to be treated
// as operational errors:
// 1) CastError - happens with invalid ObjecId
// 2) Duplicate field error (caused by MongoDB driver). Use the error code, since there's no error name
// 3) Validation Errors (ValidatorError)