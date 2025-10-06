const { User, Company, RefreshToken } = require('../../db');
const { verified } = require('../../utils/bcryptHandler');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwtHandler');
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
        'El correo no se encuentra registrado.'
      );
    }

    if (!logUser.active) {
      throw new Error('El usuario se encuentra desactivado');
    }

    const passwordHash = logUser.password;
    const isCorrect = await verified(password, passwordHash);

    if (!isCorrect) throw new Error('Contraseña incorrecta');

    const findCompany = await Company.findByPk(logUser.companyId);

    if (!findCompany && (logUser.tipo === "admin" || logUser.tipo === "empleado"))
      throw new Error('La empresa asociada a este usuario no se encontró');

    // Generate access token (15min) and refresh token (7 days)
    const accessToken = generateAccessToken(logUser);
    const refreshToken = generateRefreshToken();

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
      token: refreshToken,
      userId: logUser.id,
      expiresAt,
    });

    const data = {
      user: logUser,
      accessToken,
      refreshToken,
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
