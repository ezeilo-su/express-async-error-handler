const catchAsync = handler => (req, res, next) => {
  handler(req, res, next).catch(err => next(err));
}