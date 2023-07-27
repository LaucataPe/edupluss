const { User, Area } = require('../../db')

const getUserByCompany = async (req, res) =>{
    const {companyId} = req.params
    try {
        const findUsers = await User.findAll({
            where: {
              companyId
            }
          });
        return res.status(200).json(findUsers)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getUserByCompany}