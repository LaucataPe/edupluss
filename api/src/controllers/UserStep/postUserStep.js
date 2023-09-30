const { User, Step, Activity, UserStep } = require('../../db.js');
const { ClientError } = require('../../utils/index.js');
module.exports = async (req, res) => {
  try {
    let { userId, stepId, activityId, finished } = req.body;

    userId = parseInt(userId);
    activityId = parseInt(activityId);
    stepId = parseInt(stepId);

    const userEmployer = await User.findByPk(userId);
    const stepCompleted = await Step.findByPk(stepId);
    const activity = await Activity.findByPk(activityId);

    if (
      finished &&
      userEmployer &&
      stepCompleted &&
      activity &&
      stepCompleted.activityId === activity.id
    ) {
      if (userEmployer.tipo !== 'empleado') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an employee',
          400
        );
      } else {
        const userSteps = await UserStep.create({
          finished: finished,
          UserId: userId,
          StepId: stepId,
        });

        if (userSteps) {
          res.status(200).json({
            message: `Se registro el progreso del usuario en la actividad ${activity.title}`,
          });
        } else {
          throw new ClientError('Error al registrar el progreso', 400);
        }
      }
    } else {
      throw new ClientError(
        'Not Found: no data associated with the information sent was found or not finished step',
        404
      );
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ClientError(
        'Conflict: The user has already completed this activity',
        409
      );
    } else if (error instanceof ClientError) {
      throw new ClientError(error.message, error.status);
    } else {
      throw new ClientError('Server error, please come back later', 500);
    }
  }
};
