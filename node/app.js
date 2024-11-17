const express = require('express');
const mysql = require('mysql');

const app = express();
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'banco',
});

app.get('/', (req, res) => {
  const name = `User ${Math.floor(Math.random() * 1000)}`;

  pool.query('INSERT INTO people (name) VALUES (?)', [name], (err) => {
    if (err) {
      console.error('Erro de inserção:', err);
      return res.status(500).send('Internal Server Error - Erro de Inserção');
    }

    pool.query('SELECT name FROM people', (err, results) => {
      if (err) {
        console.error('Erro de busca de dados:', err);
        return res.status(500).send('Internal Server Error - Erro de busca de dados');
      }

      const namesList = results.map((row) => `<li>${row.name}</li>`).join('');
      res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
