module.exports = (err, req, res, next) => {
  console.error('API Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && status === 500 ? 'Something went wrong on the server' : message,
  });
};
