const express = require('express');
const updateSheets = require('./update-sheets');
const app = express();

app.use(express.json());

// The service port defaults to 3000 or is read from the program arguments
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Text to display for the service name
const serviceName = process.argv.length > 3 ? process.argv[3] : 'website';


// Provide the version of the application
app.get('/config', (_req, res) => {
  res.send({ version: '1.0.0', name: serviceName });
});

var body;

app.post('/', async (req, res) => {
  body = req.body;
  updateSheets.updateSheets(body);
  res.send(body);
});

app.get('/recent', (_req, res) => {
  res.send(body);
});

//Return the homepage if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Serve up the static content
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
