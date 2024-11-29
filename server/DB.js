const mysql = require('mysql2');
const dotenv = require('dotenv');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'InterviewsDB',
  port: 3306,
  password: '1q2w3e4r',
}).promise();

module.exports = pool;