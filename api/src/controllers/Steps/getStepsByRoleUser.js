const { Step, User, Role, Activity } = require('../../db');
const { catchedAsync } = require('../../utils');

const getStepsByRoleUser = async (req, res) => {
  const { id } = req.params;
  const employeeUser = await User.findByPk(id);
  
  try {
    const activities = await Activity.findAll({where:{
        roleId: employeeUser.roleId
    }})
    let allSteps = [];

    for (const activity of activities) {
        const steps = await Step.findAll({
          where: {
            activityId: activity.id,
          },
        });
        allSteps = allSteps.concat(steps);
    }
    

    return res.status(200).json(allSteps.length);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getStepsByRoleUser: catchedAsync(getStepsByRoleUser) };