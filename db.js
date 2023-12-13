const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'bezk5g5ddjyvpjflbhib-mysql.services.clever-cloud.com', 
  user: 'ujy53jqbnb8ngjkw',      
  password: '7wdycmcCNN3gY1TkMq6h',      
  database: 'bezk5g5ddjyvpjflbhib',
});

module.exports = pool