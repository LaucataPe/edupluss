const { Review, User } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getReviewsByActivity = async (req, res) => {
  const { activityId, userId } = req.body;
  
  try {
    const adminUser = await User.findByPk(userId);

    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const reviewsOfActivity = await Review.findAll({ 
            where: {
                activityId: activityId
            } 
        });
        if(reviewsOfActivity.length === 0) {
            res.status(200).send("Esta actividad aún no ha recibido reseñas.");
        } else {
            res.status(200).json(reviewsOfActivity);
        }  
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getReviewsByActivity: catchedAsync(getReviewsByActivity) };