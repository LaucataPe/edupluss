const { Activity, Role } = require("../../db");
const { catchedAsync } = require("../../utils");
const createActivity = async (req, res) => {
  const { title, roleId, orderId } = req.body;
  try {
    const role = await Role.findByPk(roleId);
    if (role) {
      const newActivity = await Activity.create({
        orderId,
        title,
        roleId,
        active: true,
      });
      res.status(200).json(newActivity);
    } else {
      throw new Error("No se encontró el rol especificado");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createActivity: catchedAsync(createActivity) };
