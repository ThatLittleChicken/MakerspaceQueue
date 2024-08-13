const express = require('express');
const { handleData } = require('./handle-data');
const { boxCredsFill } = require('./box-credentials-fill');
const app = express();

app.use(express.json());

// The service port defaults to 3000 or is read from the program arguments
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Text to display for the service name
const serviceName = process.argv.length > 3 ? process.argv[3] : 'website';

express.static('public');

// Provide the version of the application
app.get('/config', (_req, res) => {
  res.send({ version: '1.0.0', name: serviceName });
});

var body;
var time;

app.post('/data', async (req, res) => {
  body = req.body;
  time = new Date();
  handleData(body);
  res.send(body);
});

app.get('/recent', (_req, res) => {
  res.send({ time, body });
});

app.get('/box', async (_req, res) => {
  if (!_req.query.code) {
    res.status(400);
    res.send({ message: 'No code provided' });
  } else {
    try {
      boxCredsFill(_req.query.code);
      res.status(200);
      res.send({ message: 'Box credentials have been filled' });
    } catch (err) {
      res.status(500);
      res.send({ message: err });
    }
  }
});

app.get('/', (_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Serve up the static content
app.use(express.static('public'));

//Return the homepage if the path is unknown
app.use((_req, res) => {
  res.sendFile('404.html', { root: 'public' });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
