const { User, RefreshToken } = require('../../db');
const { generateAccessToken } = require('../../utils/jwtHandler');
const { catchedAsync } = require('../../utils');
const { Op } = require('sequelize');

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        expiresAt: {
          [Op.gt]: new Date(), // Check if not expired
        },
      },
      include: {
        model: User,
        attributes: ['id', 'tipo', 'companyId', 'roleId', 'active'],
      },
    });

    if (!storedToken) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Check if user is still active
    if (!storedToken.User.active) {
      await storedToken.destroy(); // Remove token if user is inactive
      return res.status(403).json({ error: 'User account is inactive' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(storedToken.User);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { refreshAccessToken: catchedAsync(refreshAccessToken) };
