const { User, Role, Company, Activity } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getActivitiesByAdminUser = async (req, res) => {
  let  { id }  = req.params;
  
  try {
      const adminUser = await User.findByPk(id, {
          include: [{
            model: Company,
          }]
      });
    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const companyId = adminUser.companyId ? adminUser.companyId : null;
        if (!companyId) throw new Error('Usuario admin no tiene una compañía asignada');
    
        const roles = await Role.findAll({
            where: { companyId: companyId },
        });
    
        let activities;
        for (const role of roles) {
            activities = await Activity.findAll({
                where: { roleId: role.id },
            });
        }
        res.status(200).json(activities);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getActivitiesByAdminUser: catchedAsync(getActivitiesByAdminUser) };