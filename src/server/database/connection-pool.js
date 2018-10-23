/*
 * File: connection-pool.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 10:44:57 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Tuesday, 23rd October 2018 12:01:26 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const mysql = require('mysql2/promise');
const bluebird = require('bluebird')
let pool;

module.exports = {
  getPool: () => {
    if (pool) return pool;
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'lovejoe99',
      database: 'job_network',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      Promise: bluebird
    });
    return pool;
  }
}