const { Paso } = require('../../db')

const deleteStep = async (req, res) =>{
    const {id} = req.params
    try {
        const deletePaso = await Paso.destroy({
            where: {
              id
            }
          });   
        res.status(200).json(deletePaso)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

module.exports = {deleteStep}