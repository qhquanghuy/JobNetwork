
const promisePool = require('../database/connection-pool')
const hash = require('hash.js')
const { appliedJobStatus } = require('../helper/constant')

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


function _createApplyJob(userId, jobId) {
    return promisePool
        .getPool()
        .query(
            "INSERT INTO apply_job(user_id, job_id, status) "
            + "VALUES(?, ?, ?)",
            [userId, jobId, appliedJobStatus.pending]
        )
        .then(() => {
            promisePool
                .getPool()
                .query(
                    "UPDATE job SET applicants = IFNULL(applicants, 0) + 1 "
                    + "WHERE id = ?",
                    [jobId]
                )
            })
}


function _getJobs() {
    return promisePool
        .getPool()
        .query(
            "SELECT job.*, user.name employerName FROM job "
            + "INNER JOIN user ON job.user_id = user.id "
            + "ORDER BY created_at DESC "
        )
}


function _getJobsOf(userId) {
    return promisePool
        .getPool()
        .query(
            "SELECT job.* FROM job "
            + "INNER JOIN user ON job.user_id = user.id "
            + "WHERE user_id = ? "
            + "ORDER BY created_at DESC ",
            [userId]
        )
}

function _getApplicants(employerId, jobId) {
    return promisePool
        .getPool()
        .query(
            "SELECT user.*, apply_job.created_at applied_at FROM apply_job "
            + "INNER JOIN job ON job.id = apply_job.job_id "
            + "INNER JOIN user ON apply_job.user_id = user.id "
            + "WHERE apply_job.job_id = ? ",
            [jobId, employerId]
        )
}


function _getAppliedJobsOf(userId) {
    return promisePool
        .getPool()
        .query(
            "SELECT job.*, apply_job.status, apply_job.job_id, user.name employerName FROM apply_job "
            + "INNER JOIN job ON job.id = apply_job.job_id "
            + "INNER JOIN user ON job.user_id = user.id "
            + "WHERE apply_job.user_id = ? "
            + "ORDER BY created_at DESC ",
            [userId]
        )
}

function _getSkills() {
    return promisePool
        .getPool()
        .query(
            "SELECT * from skill"
        )
}


module.exports = {
    createJob: _createJob,
    createApplyJob: _createApplyJob,
    getJobs: _getJobs,
    getJobsOf: _getJobsOf,
    getApplicants: _getApplicants,
    getAppliedJobsOf: _getAppliedJobsOf,
    getSkills: _getSkills
}