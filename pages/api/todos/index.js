const DBQuery = require('utils/db');

module.exports = async (req, res) => {
  if (!req?.headers?.authorization) {
    return res.status(404).send('Not Found');
  }

  const [username, password] = req.headers.authorization.split(':');
  const User = await DBQuery('SELECT * FROM `users` WHERE username=? AND password=?', [username, password])
    .then((users) => users.length ? users[0] : null)
    .catch((err) => {
      console.log(err);
      return null;
    });
  
  if (!User) {
    return res.status(401).send('Not Authenticated');
  }
  
  switch (req.method) {
    case 'GET':
      await DBQuery('SELECT * FROM `tasks` WHERE owner=?', User?.id)
        .then((results) => {
          res.send(results);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
      break;
    case 'POST':
      const { body } = req;
      await DBQuery('INSERT INTO tasks (title, owner) VALUES (?, ?)', [body.title, User.id])
        .then(() => res.send('Success'))
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