const jsonServer = require('json-server');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const port = 3000;

server.use(cors());
server.use(bodyParser.json()); 
server.use(middlewares);

server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);

  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  
  next();
});


server.delete('/api/todos/:id', (req, res) => {
  const taskId = req.params.id;
  console.log(`Deleting task with ID: ${taskId}`);
  
  router.db.get('todos')
    .remove({ id: Number(taskId) }) 
    .write();

  res.status(200).json({ message: 'Task deleted' });
});

server.use('/api', router);

server.listen(port, () => {
  console.log(`JSON Server is running at http://localhost:${port}`);
  console.log(`Todos API is available at http://localhost:${port}/api/todos`);
});
