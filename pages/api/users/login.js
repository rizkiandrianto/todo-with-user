const DBQuery = require('utils/db');

module.exports = async (req, res) => {
  const { body } = req;
  switch (req.method) {
    case 'POST':
      await DBQuery('SELECT * FROM `users` WHERE username=? AND password=?;', [body.username, body.password])
        .then((results) => results.length ? res.send(results[0]) : res.status(401).send('Not Authorized'))
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