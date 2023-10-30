const { User } = require('../../db');
const { catchedAsync } = require('../../utils');
const getUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findOne({where:{id}});
        if(!user) return res.status(400).json({error: "No se ha encontrado el usuario."});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = { getUser: catchedAsync(getUser) };