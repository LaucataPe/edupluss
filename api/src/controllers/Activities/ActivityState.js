const { Activity } = require('../../db');
const { catchedAsync } = require('../../utils');
const ActivityState = async (req, res) => {
  const { id } = req.query;
  try {
    const getActivity = await Activity.findByPk(id);
    const active = !getActivity.dataValues.active;

    const updateState = await getActivity.update(
      {
        active,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json(updateState);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { ActivityState: catchedAsync(ActivityState) };
