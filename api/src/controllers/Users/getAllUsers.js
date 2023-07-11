const { User, Area } = require('../../db')

const getAllUsers = async (req, res) =>{
    try {
        const users = await User.findAll({ include: Area })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {getAllUsers}