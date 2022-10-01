const bcrypt = require('bcrypt');

let hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

let comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = {hashPassword, comparePassword};
