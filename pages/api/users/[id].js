const DBQuery = require('utils/db');

module.exports = async (req, res) => {
  const { body, query } = req;
  switch (req.method) {
    case 'PUT':
      const { username, name, password } = body;
      await DBQuery('UPDATE users SET password=?,username=?,name=? WHERE id=?;', [password, username, name, query.id])
        .then(() => res.send(body))
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
      break;
    case 'GET':
      await DBQuery('SELECT * FROM `users` WHERE id=?;', [query.id])
        .then((results) => results.length ? res.send(results[0]) : res.status(404).send('Not Found'))
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
        break;
    case 'DELETE':
      await DBQuery('DELETE FROM `users` WHERE id=?;', [query.id])
        .then(() => res.send(`Deleted user id ${query.id}!`))
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