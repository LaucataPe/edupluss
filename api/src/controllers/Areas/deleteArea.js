const { Area, Role, Activity, Step } = require('../../db');

const deleteAreaCascade = async (req, res) => {
    const { id } = req.params;
    try {
    // Buscar el área por su ID y también incluir los roles asociados
    const area = await Area.findOne({
      where: { id },
      include: [
        {
          model: Role,
          include: [
            {
              model: Activity,
              include: [Step] // Incluir también los pasos asociados a las actividades
            }
          ]
        }
      ]
    });

    if (!area) {
      throw new Error('Área no encontrada');
    }

    // Eliminar en cascada: primero eliminar los pasos, luego las actividades, luego los roles y finalmente el área
    await Promise.all(
      area.Roles.map(async (role) => {
        await Promise.all(
          role.Activities.map(async (activity) => {
            await Step.destroy({ where: { activityId: activity.id } });
            await activity.destroy();
          })
        );
        await role.destroy();
      })
    );

    await area.destroy();

    res.status(200).json({ message: 'Área y registros relacionados eliminados correctamente' });

  } catch (error) {
    res.status(404).send(error.message);
  };
}
module.exports = { deleteAreaCascade };
