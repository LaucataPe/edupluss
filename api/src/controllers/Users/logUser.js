const { Usuario } = require('../../db')
const {verified} = require('../../utils/bcryptHandler')

const logUser = async (req, res) =>{
    const { email, password } = req.body
    console.log(req.body);
    try {
        const newUser = await Usuario.findOne({
            where: {
                email
            },
        })
        if (!userExist?.email) {
            throw new Error(
                "El correo electrónico que ingresaste no se encuentra registrado."
            );
        }

		// Traigo la password encryptada de la db y comparo con el recibido por body
		const passwordHash = userExist.password;
		const isCorrect = await verified(password, passwordHash);

		//Si no coincide
		if (!isCorrect) throw new Error("Revisá tu contraseña.");


        res.status(200).json(newUser)
    } catch (error) {
        res.status(404).send(error.message)
    }
}
module.exports = {logUser}

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