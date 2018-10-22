/*
 * File: connection-pool.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 10:44:57 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 10:57:16 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





import mysql from 'mysql2';

let pool;

module.exports = {
  getPool: () => {
    if (pool) return pool;
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'lovejoe99',
      database: 'job_network'
    });
    return pool.promise();
  }
}