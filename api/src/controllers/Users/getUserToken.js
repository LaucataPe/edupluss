const { verifyToken } = require('../../utils/jwtHandler');
const { Company, User } = require('../../db');
const { catchedAsync } = require('../../utils');
const getByToken = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(' ')[1] : null;

  if (token) {
    try {
      const tokenData = verifyToken(token);
      if (tokenData) {
        // New token format: { id, tipo, companyId, roleId }
        const userId = tokenData.id;
        const companyId = tokenData.companyId;

        // Fetch user data from database
        const user = await User.findByPk(userId);

        if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Check if user has a company (not superadmin)
        if (companyId) {
          const findCompany = await Company.findByPk(companyId);
          if (findCompany) {
            const info = {
              data: {
                user: user,
              },
              findCompany,
            };
            return res.status(200).send(info);
          }
        }

        // User is superadmin (no company)
        return res.status(200).send({ user });
      } else {
        return res.status(401).json({ error: 'Token inválido' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  }

  return res.status(401).json({ error: 'No se proporcionó token' });
};

module.exports = { getByToken: catchedAsync(getByToken) };
