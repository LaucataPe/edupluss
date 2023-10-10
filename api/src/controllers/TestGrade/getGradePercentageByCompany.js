const { User, Role, Company, Activity, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getGradePercentageByCompany = async (req, res) => {
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
    
        let totalGradeValue = 0;
        let totalMaximunGradeValue = 0;
        let activities;
        let allTestGrades = [];
    
        for (const role of roles) {
            activities = await Activity.findAll({
                where: { roleId: role.id },
        });
        
        for (const activity of activities) {
            const testGrades = await TestGrade.findAll({
              where: { activityId: activity.id },
            });
    
            allTestGrades = allTestGrades.concat(testGrades);
    
            for (const testGrade of testGrades) {
              totalGradeValue += testGrade.gradeValue;
              totalMaximunGradeValue += testGrade.maximunGradeValue;
            }
          }
        }
    
        const gradePercentage = parseFloat(((totalGradeValue / totalMaximunGradeValue) * 100).toFixed(2));
    
        res.status(200).json(gradePercentage);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getGradePercentageByCompany: catchedAsync(getGradePercentageByCompany) };