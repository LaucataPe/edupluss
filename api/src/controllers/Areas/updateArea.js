const { Area } = require('../../db');
const { catchedAsync } = require('../../utils');
const updateArea = async (req, res) => {
  const { id, name } = req.body;
  console.log(req.body);
  try {
    const getArea = await Area.findByPk(id);

    if (!getArea) throw new Error('Área no encontrada');

    const updateArea = await getArea.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json(updateArea);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateArea: catchedAsync(updateArea) };
