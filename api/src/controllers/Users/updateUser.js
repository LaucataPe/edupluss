const { User } = require('../../db');
const { catchedAsync } = require('../../utils');
const { encrypt } = require('../../utils/bcryptHandler');

const updateUser = async (req, res) => {
  const { id, username, email, password, tipo, active, roleId } = req.body;
  console.log(req.body);
  try {
    const getUser = await User.findByPk(id);

    if (!getUser) throw new Error('Usuario no encontrado');

    let passwordHash = await encrypt(password);

    let role = roleId;
    if (tipo !== 'empleado') {
      role = null;
    }

    if (password.length !== 0) {
      const updateUser = await getUser.update(
        {
          username,
          email,
          password: passwordHash,
          tipo,
          active,
          roleId: role,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json(updateUser);
    } else {
      console.log('No hay contraseña');
      const updateUser = await getUser.update(
        {
          username,
          email,
          tipo,
          active,
          roleId: role,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json(updateUser);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateUser: catchedAsync(updateUser) };
