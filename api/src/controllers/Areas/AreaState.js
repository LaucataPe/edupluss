const { Area } = require('../../db');
const { catchedAsync } = require('../../utils');
const AreaState = async (req, res) => {
  const { id } = req.query;
  try {
    const getArea = await Area.findByPk(id);
    const active = !getArea.dataValues.active;

    const updateState = await getArea.update(
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

module.exports = { AreaState: catchedAsync(AreaState) };
