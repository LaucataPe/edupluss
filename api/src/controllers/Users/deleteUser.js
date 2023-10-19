const { User } = require("../../db");
const { catchedAsync } = require("../../utils");
const deleteUser = async (req, res) => {
  const { companyUsersId } = req.params;
  const { usersToDelete } = req.body;
  const currentUserID = req.companyId.toString();

  if (companyUsersId !== currentUserID) {
    return res
      .status(401)
      .json({ error: "you cannot delete users from other companies" });
  }
  try {
    User.destroy({ where: { id: usersToDelete } });

    return res.status(200).send("deleted users");
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

module.exports = { deleteUser: catchedAsync(deleteUser) };
