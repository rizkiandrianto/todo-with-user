const DBQuery = require('utils/db');

module.exports = async (req, res) => {
  switch (req.method) {
    case 'GET':
      await DBQuery('SELECT * FROM `users`')
        .then((results) => res.send(results))
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
      break;
    case 'POST':
      const { body } = req;
      const { username, name, password } = body;
      await DBQuery('INSERT INTO users (name, username, password) VALUES (?,?,?);', [name, username, password])
        .then(() => res.send(body))
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
      break;
    default:
      res.status(404).send('Not Found');
      break;
  }
}