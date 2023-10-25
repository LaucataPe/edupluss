const { User } = require('../../db');
const { catchedAsync } = require('../../utils');
const patchUser = require('./patchUser');
const { validateUpdateUser } = require('./userSchema');

const updatePatchUser = async (req, res) => {

    try {
        const validation = validateUpdateUser(req.body);
      
        if(!validation.success){
          return res.status(400).json({message: validation.error.issues[0].message})
        }
        const userUpdated = await patchUser(validation.data);
      
        if(typeof userUpdated === "string"){
          return res.status(404).json({message: userUpdated})
        }
      
        res.status(200).json(userUpdated)
      } catch (error) {
        res.status(500).json({error: error})
      }
};

module.exports = { updatePatchUser: catchedAsync(updatePatchUser) };