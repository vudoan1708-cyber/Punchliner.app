const cors = require('cors');

const path = require('path');
const express = require('express');

const root = path.join(__dirname, '../dist');
const port = process.env.PORT || 5000;

// ROUTES
const databaseRoute = require('./routes/database')

const app = express();
const http = require('http');
const server = http.createServer(app);

// listening to any dynamic port number
server.listen(port, () => console.log('Listening on port ' + port));
app.use(express.json({ limit: '1mb' }));

app.use(cors());

// use routes
databaseRoute(app);

// check if the app is running in production
if (process.env.NODE_ENV === 'production') {

  // use the static files
  app.use(express.static(root));

// otherwise
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}
