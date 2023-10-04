const { Review, User } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const deleteReview = async (req, res) => {
  const { adminId, reviewId } = req.body;

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
        const review = await Review.findByPk(reviewId);
        if(review){
            await Review.destroy({ where: { id: reviewId } });
            res.status(200).json({message: "Reseña eliminada correctamente."});
        } else {
            throw new Error("La reseña no existe.");
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteReview: catchedAsync(deleteReview) };