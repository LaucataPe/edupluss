const { User } = require('../../db');
const { encrypt, verified } = require('../../utils/bcryptHandler');
const { generateToken } = require('../../utils/jwtHandler');


const patchUser = async(data) => {
  const { email } = data;   
  console.log(data)
    try {
        const getUser = await User.findByPk(data.id);
    
        if (!getUser) return({error:'Usuario no encontrado'});

        if(email){
          const userEmail = await User.findOne({where:{
            email
          }});
          if (userEmail && data.id !== userEmail.id) {
            return ({error:
              'El correo electrónico es usado por otro usuario.'
            });
          }
        }
    
        if (data.password && data.password.length !== 0) {
          if (data.newPassword) {
            //!Caso: Usuario (cualquiera) quiere cambiar su contraseña
            const isCorrect = await verified(data.password, getUser.password);
            if (!isCorrect) return ({error:'Contraseña incorrecta, vuelva a intentarlo.'});
            data.password = data.newPassword
            let passwordHash = await encrypt(data.password);
            data.password = passwordHash;

            const token = await generateToken(getUser);

            const dataReturned = {
              user: getUser,
              token,
            };
            getUser.set(data).save();
            return dataReturned;
          }
          //!Caso: Admin que cambiar la contraseña a un usuario empleado
          let passwordHash = await encrypt(data.password);
          data.password = passwordHash;
          getUser.set(data).save();
          return getUser;
        } else {
          //!Caso: No hay contraseña, recibe solo nombre, avatar (o correo en el caso del admin)
          getUser.set(data).save();
          return getUser;
        }
      } catch (error) {
        res.status(404).send(error.message);
      }
}

module.exports = patchUser;