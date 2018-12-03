/*
 * File: user-dao.js
 * Project: simple-react-full-stack
 * File Created: Sunday, 2nd December 2018 12:15:23 pm
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 3rd December 2018 8:30:16 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */






const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { idWithLog } = require('./../helper/functions')
const { userRole, requestedCertStatus } = require('./../helper/constant')

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



function _updateSuccessCert(certs) {
    let conn
    return promisePool
        .getPool()
        .getConnection()
        .then(connection => {
            conn = connection
            return connection.query('START TRANSACTION');
        })
        .then(() => {
            // do queries inside transaction
            certs.forEach(cert => {
                conn.query(
                    "UPDATE request_cert SET status = ?, cert_json = ? WHERE user_id = ?",
                    [requestedCertStatus.approved, JSON.stringify(cert), cert.recipientProfile.id]
                )
            });
        })
        .then(() => {
            return conn.query('COMMIT');
        })
}


module.exports = {
    createIssuerMember: _createIssuerMember,
    createCert: _createCert,
    updateSuccessCert: _updateSuccessCert
}