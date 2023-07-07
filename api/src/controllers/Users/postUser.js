const { Usuario } = require('../../db')
const {encrypt, verified} = require('../../utils/bcryptHandler')

const createUser = async (req, res) =>{
    const { email, password } = req.body

    try {
        const userFound = await Usuario.findOne({ where: { username: email } });

        if (userFound?.email) {
            throw new Error("Ya existe una cuenta creada con ese e-mail");
        }
        const passwordHash = await encrypt(password);
        const newUser = await Usuario.create({username: email, password: passwordHash})
        
        res.status(200).json(newUser)
    } catch (error) {
        res.status(404).send(error.message)
    }
}
module.exports = {createUser}
