const { Activity, Area } = require('../../db');

const createActivity = async (req, res) => {
  const { title, areaId } = req.body;
  try {
    const area = await Area.findByPk(areaId)
    if(area){
      const newActivity = await Activity.create({ title, areaId, active: true, companyId: area.companyId });
      res.status(200).json(newActivity);
    }else{
      throw new Error("No se encontró el área especificada");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createActivity };

