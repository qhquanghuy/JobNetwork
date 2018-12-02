
const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { idWithLog } = require('./../helper/functions')
const { userRole } = require('./../helper/constant')
function _createUser(user) {
    return promisePool
        .getPool()
        .query(
            "INSERT INTO user (email, password_hash, name, role) VALUES(?, ?, ?, ?)",
            [user.email, hash.sha256().update(user.password).digest('hex'), user.name, user.role]
        )
        .then(([row]) => {
            user.id = row.insertId
            if (user.role === userRole.issuer) {
                return promisePool
                        .getPool()
                        .query(
                            "INSERT INTO issuer (id, web_page, ec_public_key) VALUES(?, ?, ?)",
                            [user.id, user.webPage, user.ecPublicKey]
                        )
                        .then(([row]) => {
                            return user
                        })
            } else {
                return Promise.resolve(user)
            }
        })
}


function _findUserByEmail(email, password) {
    return promisePool
        .getPool()
        .query(
            "SELECT user.* FROM user "
            + " WHERE user.email = ? AND user.password_hash = ?",
            [email, hash.sha256().update(password).digest('hex')]
        )
}
function _getUserProfileById(id) {
    return promisePool
        .getPool()
        .query(
            "SELECT user.*, skill.name skill_name, issuer.web_page webPage, issuer.ec_public_key ecPublicKey "
            + "FROM user "
            + "LEFT JOIN user_skill on user.id = user_skill.user_id "
            + "LEFT JOIN skill on user_skill.skill_id = skill.id "
            + "LEFT JOIN issuer on user.id = issuer.id "
            + "WHERE user.id = ?",
            [id]
        )
}
module.exports = {
    createUser: _createUser,
    findUserByEmail: _findUserByEmail,
    getUserProfileById: _getUserProfileById
}