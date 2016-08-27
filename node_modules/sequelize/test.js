var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'bi.kase.se',
  user     : 'schj_api',
  password : 'TeddyovTiurlOnphIt',
  database : 'schj',
  ssl: {
     rejectUnauthorized: false

  }
});

connection.connect(function (err) {
        console.log(err);
});

console.log('hej');
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        console.log('hey');
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});
console.log('her')
//connection.end();
                    
