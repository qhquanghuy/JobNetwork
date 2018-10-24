
const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { idWithLog } = require('./../helper/functions')
function _createUserTrans(user) {
    return (connection) => {
        return connection
            .query('START TRANSACTION')
            .then(() => {
                return connection.query(
                    'INSERT INTO common_info (email, password_hash, name) VALUES(?,?,?)',
                    [user.email, hash.sha256().update(user.password).digest('hex'), user.name]
                )
            })
            .then(res => res[0].insertId)
            .then(id => {
                return connection.query(
                    'INSERT INTO user (id,role) VALUES(?,?)',
                    [id, user.role]
                )
            })
            .then(() => connection.query('COMMIT'))
            .catch(err => {
                connection.query("ROLLBACK")
                throw err
            })
            .finally(() => { 
                connection.release()
            })
    }
}


function _findUserByEmail(email, password) {
    return promisePool
        .getPool()
        .query(
            "SELECT common_info.* FROM common_info "
            + "INNER JOIN user on common_info.id = user.id"
            + " WHERE common_info.email = ? AND password_hash = ?",
            [email, hash.sha256().update(password).digest('hex')]
        )
}
function _getUserProfileById(id) {
    return promisePool
        .getPool()
        .query(
            "SELECT common_info.*, user.role, user.member_of_issuer, skill.name, "
            + "FROM common_info "
            + "INNER JOIN user on common_info.id = user.id"
            + "INNER JOIN user_skill on user.id = user.id"
            + "INNER JOIN skill on user_skill.skill_id = skill.id"
            + " WHERE common_info.id = ?",
            [id]
        )
}
module.exports = {
    createUser: (user) => {
        return promisePool
                .getPool()
                .getConnection()
                .then(_createUserTrans(user))
                .then(() => user)    
    },
    findUserByEmail: _findUserByEmail,
    getUserProfileById: _getUserProfileById
}