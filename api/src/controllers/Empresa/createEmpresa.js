const { Empresa } = require('../../db')


const createEmpresa = async (req, res) =>{
    const { name, nit } = req.body
    try {
        const newEmpresa = await Empresa.create({name, nit})
        res.status(200).json(newEmpresa)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

module.exports = {createEmpresa}

