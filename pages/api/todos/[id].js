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

  const { body, query } = req;
  
  switch (req.method) {
    case 'PUT':
      await DBQuery('UPDATE tasks SET title=?,is_done=? WHERE id=?;', [body.title, body.is_done, query.id])
        .then(() => res.send('Success'))
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
      break;
    case 'DELETE':
      await DBQuery('DELETE FROM `tasks` WHERE id=?;', [query.id])
        .then(() => res.send(`Deleted task id ${query.id}!`))
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