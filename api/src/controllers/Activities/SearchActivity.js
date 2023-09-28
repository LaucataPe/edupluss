const { Activity } = require('../../db');
const { catchedAsync } = require('../../utils');
const SearchActivity = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    if (Object.keys(req.query).length > 0) {
      const filter = activities.filter((activity) =>
        activity.title.toLowerCase().includes(req.query.name.toLowerCase())
      );
      return res.status(200).json(filter);
    } else {
      return res.status(200).json(activities);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { SearchActivity: catchedAsync(SearchActivity) };
