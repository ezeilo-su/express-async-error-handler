module.exports = (err, req, res, next) => {
  
  err.status ||= 'error';
  err.statusCode ||= 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};