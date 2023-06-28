const { Empresa } = require('../../db')

const getAllEmpresas = async (req, res) =>{
    try {
        const empresas = await Empresa.findAll()
        return res.status(200).json(empresas)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {getAllEmpresas}