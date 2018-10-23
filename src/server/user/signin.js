/*
 * File: signin.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:22 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Tuesday, 23rd October 2018 12:06:33 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */


const promisePool = require('../database/connection-pool')

function _createUserTrans(user) {
    return (connection) => {
        return connection
            .query('START TRANSACTION')
            .then(() => {
                return connection.query(
                    'INSERT INTO common_info (email, password_hash, name, public_key, description) VALUES(?,?,?,?,?)',
                    [user.email, user.password, user.name, user.publicKey, ""]
                )
            })
            .then(res => res[0].insertId)
            .then(id => {
                connection.query(
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
        promisePool
            .getPool()
            .getConnection()
            .then(_createUserTrans(user))    
    }
}