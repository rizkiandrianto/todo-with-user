const mysql = require('mysql');

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as thread id: ' + connection.threadId);
});

const DBQuery = (query, param = []) => new Promise((resolve, reject) => {
  connection.query(query, param, (err, results) => {
    if (!err) {
      resolve(results);
    } else {
      reject(err);
    }
  });
})

  module.exports = DBQuery;