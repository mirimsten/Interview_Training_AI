const mysql = require('mysql2');
const dotenv = require('dotenv');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'InterviewsDB',
  port: 3306,
  password: 'mysql24',
}).promise();

module.exports = pool;