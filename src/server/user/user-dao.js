
const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
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
            .finally(() => { 
                return connection.query('COMMIT')
            })
    }
}

module.exports = {
    createUser: (user) => {
        return promisePool
                .getPool()
                .getConnection()
                .then(_createUserTrans(user))
                .then(() => user)    
    }
}