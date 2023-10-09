const { Activity } = require('../../db');

const patchActivity = async(id, data) => {
    const activityFound = await Activity.findByPk(id);
    console.log(activityFound);

    if (!activityFound) return('No existe una Actividad con el id proporcionado');

    activityFound.set(data).save();

    return activityFound;
}

module.exports = patchActivity;