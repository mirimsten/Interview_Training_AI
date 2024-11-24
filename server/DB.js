const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'InterviewsDB',
  port: 3306,
  password: process.env.DB_PASSWORD,
}).promise();

module.exports = pool;