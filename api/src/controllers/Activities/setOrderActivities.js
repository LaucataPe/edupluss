const { catchedAsync } = require("../../utils");
const { Activity } = require("../../db");

const setOrderActivities = async (req, res) => {
  try {
    const { roleId } = req.params;
    const activitiesToChange = req.body;
    const activitiesDB = await Activity.findAll({
      where: {
        roleId,
      },
    });
    activitiesDB.forEach(async (element) => {
      const activitieToChange = activitiesToChange.find(
        (e) => e.id === element.dataValues.id
      );

      if (activitieToChange.orderId !== element.orderId) {
        await Activity.update(
          {
            orderId: activitieToChange.orderId,
          },
          {
            where: {
              id: activitieToChange.id,
            },
          }
        );
      }
    });

    res.status(200).json("succes");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { setOrderActivities: catchedAsync(setOrderActivities) };
