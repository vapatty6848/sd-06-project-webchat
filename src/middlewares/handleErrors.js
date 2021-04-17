const AppError = require('../errors/AppError');

function handleErrors(err, _request, response, _next) {
  if (err instanceof AppError) {
    return response.status(err.status).json({ error: err.message });
  }

  console.log(err);

  return response.status(500).json({ error: 'Internal Server Error' });
}

module.exports = handleErrors;
