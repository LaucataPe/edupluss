const { Activity, User, Step } = require('../../db');
const { catchedAsync } = require('../../utils');

const getActivitiesByUser = async (req, res) => {
    const {id} = req.params;
    try {
        const employeeUser = await User.findByPk(id);
        
        if (employeeUser.tipo !== 'empleado') {
            throw new ClientError(
              'incorrect request: the data sent does not correspond to an employee',
              400
            );
        } else {
            // Obtener las actividades y contar los pasos completados por el usuario en cada una
            const activitiesWithStepsCount = await Activity.findAll({
                where: {
                    roleId: employeeUser.roleId
                },
                attributes: ['id', 'title', 'numberSteps', 'hasTest' ],
                include: [
                {
                    model: Step,
                    attributes: [],
                    duplicating: false,
                    as: 'Steps'
                }
                ],
                group: ['Activity.id'],
                raw: true,
                nest: true
            });
            
            // Agregar la cantidad de pasos completados por el usuario en cada actividad
            for (const activity of activitiesWithStepsCount) {
                const stepCount = await Step.count({
                where: {
                    activityId: activity.id
                },
                include: [
                    {
                        model: User,
                        where: {
                            id: employeeUser.id
                        },
                        as: 'Users'
                    }
                ]
                });
                activity.stepsFinishedCount = stepCount;
            }
            return res.status(200).json(activitiesWithStepsCount);
        }  
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = { getActivitiesByUser: catchedAsync(getActivitiesByUser) };
