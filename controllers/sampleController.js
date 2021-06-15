// Note: All code here is an illustration!!!

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllUsers = catchAsync(async (req, res, next) => {
  // request handling goes here!!!
});

const getUser = catchAsync(async (req, res, next) => {
  // request handling goes here!!!
  const user = awail User.findById(req.params.id);

  // Implement 404 (Not found) error response
  if(!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
});