const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost', 
  user: 'root',      
  password: '',      
  database: 'ads_booking_db',
});

module.exports = pool