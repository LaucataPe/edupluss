const { Review, User } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getReviewsByUser = async (req, res) => {
  const { adminId, userId } = req.body;

  try {
    const adminUser = await User.findByPk(adminId);
    if (!adminUser) {
      throw new ClientError(
        'incorrect request: admin ID does not exist',
        404
      )};

    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const employeeUser = await User.findByPk(userId);

        if(!employeeUser) throw new Error("El empleado no existe.")

        if (employeeUser.tipo !== 'empleado') {
            throw new ClientError(
              'incorrect request: the data sent does not correspond to an employee',
              400
            );
        } else {
            const reviewsOfUser = await Review.findAll({ 
                where: {
                    userId: userId
                } 
            });
            if(reviewsOfUser.length === 0) {
                res.status(200).send("Este empleado aún no ha hecho reseñas.");
            } else {
                res.status(200).json(reviewsOfUser);
            }  
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getReviewsByUser: catchedAsync(getReviewsByUser) };