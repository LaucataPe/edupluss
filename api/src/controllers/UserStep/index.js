const { catchedAsync } = require("../../utils");
module.exports = {
  postUserStep: catchedAsync(require("./postUserStep.js")),
  getUserSteps: catchedAsync(require("./getUserStep.js")), // Agrega la ruta GET a UserSteps
};
