const { Company } = require('../../db')

const getAllCompanies = async (req, res) =>{
    try {
        const companies = await Company.findAll()
        return res.status(200).json(companies)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {getAllCompanies}