const catchAsync = require('../utils/catchAsync');

const destroy = catchAsync(async (req, res) => {
  const genre = await Genre.deleteOne({ _id: req.params.id });

  if (!genre) {
    return next (new AppError('The genre with the given ID was not found.', 404));
  }

  return res.status(204).json({
    status: 'success',
    data: null
  });
});

const show = catchAsync(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return next (new AppError('The genre with the given ID was not found.', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      genre
    }
  });
});