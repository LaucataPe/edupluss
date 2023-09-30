const { ClientError } = require('../../utils');

module.exports = (req, res, next) => {
  const { userId, stepId } = req.body;
  if (userId && stepId) {
    return next();
  } else {
    throw new ClientError(
      'incorrect request: you must submit the required data to save progress',
      400
    );
  }
};
