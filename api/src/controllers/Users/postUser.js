const { User, Area } = require('../../db');
const { encrypt } = require('../../utils/bcryptHandler');

const createUser = async (req, res) => {
  const { username, email, password, companyId, tipo, roleId } = req.body;

  try {
    const userFound = await User.findOne({ where: { email } });

    if (userFound && userFound.email) {
      throw new Error("Ya existe una cuenta creada con ese e-mail");
    }

    const passwordHash = await encrypt(password);
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      companyId,
      active: true,
      roleId,
      tipo
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createUser };