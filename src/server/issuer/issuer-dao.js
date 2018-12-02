/*
 * File: user-dao.js
 * Project: simple-react-full-stack
 * File Created: Sunday, 2nd December 2018 12:15:23 pm
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Sunday, 2nd December 2018 3:59:02 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */






const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { idWithLog } = require('./../helper/functions')
const { userRole } = require('./../helper/constant')

function _createIssuerMember(issuerId, userId, issuerSysId) {
    return promisePool
            .getPool()
            .query(
                "INSERT INTO issuer_member(issuer_id, user_id, issuer_system_identifier) "
                + "VALUES (?, ?, ?)",
                [issuerId, userId, issuerSysId]
            )
            .then(([row]) => {
                return row.insertId
            })
}


function _createCert(cert) {
    return promisePool
            .getPool()
            .query(
                "INSERT INTO published_cert(issuer_id, description, title, badge_icon) "
                + "VALUES (?, ?, ?, ?)",
                [cert.issuerId, cert.description, cert.title, cert.badgeIcon]
            )
            .then(([row]) => {
                return row.insertId
            })
}


module.exports = {
    createIssuerMember: _createIssuerMember,
    createCert: _createCert
}