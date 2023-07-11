const {hash, compare} = require('bcryptjs')

const encrypt = async (password) => {
	const passwordHash = await hash(password, 8);
	return passwordHash;
};

const verified = async (password, passwordHash) => {
	const isCorrect = await compare(password, passwordHash);
	return isCorrect;
};
module.exports = {
	encrypt, verified
};
