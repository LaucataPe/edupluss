const { catchedAsync } = require('../../utils');

module.exports = {
  postUserStep: catchedAsync(require('./postUserStep.js')),
};
