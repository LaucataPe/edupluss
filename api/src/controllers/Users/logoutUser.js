const { RefreshToken } = require('../../db');
const { catchedAsync } = require('../../utils');

const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Delete refresh token from database
    const deleted = await RefreshToken.destroy({
      where: { token: refreshToken },
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Refresh token not found' });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { logoutUser: catchedAsync(logoutUser) };
