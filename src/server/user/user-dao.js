
const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { idWithLog } = require('./../helper/functions')
function _createUser(user) {
    return promisePool
        .getPool()
        .query(
            "INSERT INTO user (email, password_hash, name, role) VALUES(?, ?, ?, ?)",
            [user.email, hash.sha256().update(user.password).digest('hex'), user.name, user.role]
        )
        .then(([row]) => {
            user.id = row.insertId
            return user
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
            "SELECT user.*, skill.name skill_name "
            + "FROM user "
            + "LEFT JOIN user_skill on user.id = user.id "
            + "LEFT JOIN skill on user_skill.skill_id = skill.id "
            + "WHERE user.id = ?",
            [id]
        )
}
module.exports = {
    createUser: _createUser,
    findUserByEmail: _findUserByEmail,
    getUserProfileById: _getUserProfileById
}