const { Role, Activity, Step } = require('../../db');
const { catchedAsync } = require('../../utils');
const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar el área por su ID y también incluir los roles asociados
    const role = await Role.findOne({
      where: { id },
      include: [
        {
          model: Activity,
          include: [Step], // Incluir también los pasos asociados a las actividades
        },
      ],
    });

    if (!role) {
      throw new Error('Cargo no encontrado');
    }

    // Eliminar en cascada: primero eliminar los pasos, luego las actividades, luego los roles y finalmente el área
    await Promise.all(
      role.Activities.map(async (activity) => {
        await Step.destroy({ where: { activityId: activity.id } });
        await activity.destroy();
      })
    );

    await role.destroy();

    res
      .status(200)
      .json({
        message: 'Cargo y registros relacionados eliminados correctamente',
      });
  } catch (error) {
    res.status(404).send(error.message);
  }
};
module.exports = { deleteRole: catchedAsync(deleteRole) };
