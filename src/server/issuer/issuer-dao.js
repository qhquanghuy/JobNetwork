/*
 * File: user-dao.js
 * Project: simple-react-full-stack
 * File Created: Sunday, 2nd December 2018 12:15:23 pm
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Wednesday, 26th December 2018 7:12:29 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */






const promisePool = require('../database/connection-pool')
const { requestedCertStatus } = require('./../helper/constant')

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


function _getCertRequests(publishedCertId, issuerId) {
    return promisePool
        .getPool()
        .query(
            "SELECT user.*, request_cert.created_at, request_cert.status, issuer_member.issuer_system_identifier FROM request_cert "
            + "INNER JOIN user ON request_cert.user_id = user.id "
            + "INNER JOIN issuer_member ON request_cert.user_id = issuer_member.user_id "
            + "WHERE published_cert_id = ? AND issuer_member.issuer_id = ? "
            + "ORDER BY request_cert.created_at DESC ",
            [publishedCertId, issuerId]
        )
}


function _getCerts(userId, issuerId) {
    return promisePool
        .getPool()
        .query(
            "SELECT published_cert.*, "
            + "CASE "
            + " WHEN request_cert.user_id = ? THEN 1 "
            + " ELSE 0 "
            + "END isRequested "
            + "FROM published_cert "
            + "LEFT JOIN request_cert ON published_cert.id = request_cert.published_cert_id "
            + "WHERE issuer_id = ?",
            [userId, issuerId]
        )
}


function _getCertsOfUser(userId) {
    return promisePool
        .getPool()
        .query(
            "SELECT request_cert.*, published_cert.title, published_cert.description, published_cert.badge_icon FROM request_cert "
            + "INNER JOIN published_cert ON request_cert.published_cert_id = published_cert.id "
            +"WHERE request_cert.user_id = ? "
            + "ORDER BY request_cert.created_at ",
            [userId]
        )
}

function _deleteCert(certId, issuerId) {
    return promisePool
        .getPool()
        .query(
            "DELETE FROM published_cert WHERE published_cert.id = ? AND issuer_id = ?",
            [certId, issuerId]
        )
}

module.exports = {
    deleteCert: _deleteCert,
    createIssuerMember: _createIssuerMember,
    createCert: _createCert,
    updateSuccessCert: _updateSuccessCert,
    getCertRequests: _getCertRequests,
    getCerts: _getCerts,
    getCertsOfUser: _getCertsOfUser
}