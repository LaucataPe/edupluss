const { Review, User } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getReview = async (req, res) => {
  const { userId, activityId } = req.query;

  try {
    const reviewOfEmployee = await Review.findOne({ 
        where: {
            userId: userId,
            activityId: activityId
        } 
    });
    if(!reviewOfEmployee) {
        let reviewNotFound = false;
        res.status(200).json(reviewNotFound);
    } else {
        res.status(200).json(reviewOfEmployee.reviewRated);
    }   
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getReview: catchedAsync(getReview) };