const { User, Company } = require('../../db');
const { verified } = require('../../utils/bcryptHandler');
const { generateToken } = require('../../utils/jwtHandler');
const { catchedAsync } = require('../../utils');

const logUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const logUser = await User.findOne({
      where: {
        email,
      },
    });
    if (!logUser || !logUser.email) {
      throw new Error(
        'El correo electrónico que ingresaste no se encuentra registrado.'
      );
    }

    if (!logUser.active) {
      throw new Error('El usuario se encuentra desactivado');
    }

    const passwordHash = logUser.password;
    const isCorrect = await verified(password, passwordHash);

    if (!isCorrect) throw new Error('Contraseña incorrecta');

    const findCompany = await Company.findByPk(logUser.companyId);

    if (!findCompany)
      throw new Error('La empresa asociada a este usuario no se encontró');

    const token = await generateToken(logUser);

    const data = {
      user: logUser,
      token,
      company: findCompany,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
module.exports = { logUser: catchedAsync(logUser) };

/*export const userCredentials = async (authLogin) => {
	const userExist = await User.findOne({
		where: {
			email: authLogin.email,
		},
	});

	? Validacion user
	if (!userExist?.email) {
		throw new Error(
			"El correo electrónico que ingresaste no se encuentra registrado."
		);
	}

	? traigo la password encryptada de la db y comparo con el recibido por body
	const passwordHash = userExist.password;
	const isCorrect = await verified(authLogin.password, passwordHash);

	? si no coincide
	if (!isCorrect) throw new Error("Revisá tu contraseña.");

	? si todo sale bien retorno el usuario
	const token = await generateToken(userExist);

	const data = {
		token,
		user: userExist,
	};

	return data;
};*/
