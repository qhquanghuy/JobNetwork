
const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { idWithLog } = require('../helper/functions')
const { userRole, appliedJobStatus } = require('../helper/constant')

function _createJob(job) {
    return promisePool
        .getPool()
        .query(
            "INSERT INTO job(user_id, quantity, deadline, title, description, location, skills) "
            + "VALUES(?, ?, ?, ?, ?, ?, ?)",
            [job.userId, job.quantity, job.deadline, job.title, job.description, job.location, job.skills.map(job => { return job.name }).join("|")]
        )
        .then(([row]) => {

            let conn

            promisePool
                .getPool()
                .getConnection()
                .then((connection) => {
                    conn = connection
                    return connection.query('START TRANSACTION');
                })
                .then(() => {
                    job.skills.forEach(skill => {
                        conn.query(
                            "INSERT INTO job_skill (job_id, skill_id) "
                            + "VALUES (?, ?)",
                            [row.insertId, skill.id]
                        )
                    });
                })
                .then(() => {
                    return conn.query('COMMIT');
                })
        })
}
module.exports = {
    createJob: _createJob
}