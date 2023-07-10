const { User } = require('../../db');

const UserState = async (req, res) => {
    const {id} = req.query
  try {
    const getUser = await User.findByPk(id)
    const active = !getUser.dataValues.active

    const updateState = await getUser.update({
        active
    }, {
        where: {
            id
        }
    })
    res.status(200).json(updateState);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { UserState };