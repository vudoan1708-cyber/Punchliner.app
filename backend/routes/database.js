// configure the connection to MongoDB
const createConnection = require('../data/connection');

// MongoDB database
const getAllData = require('../logic/GetAllData');
const createData = require('../logic/CreateData');
const updateData = require('../logic/UpdateData');

// Login
const loginRoute = require('../routes/login');

module.exports = async(app) => {

  // configure the connection to MongoDB databases
  // 0 (accounts settings)
  // 1 (documents settings)
  const accounts_db = createConnection(0);
  const documents_db = createConnection(1);

  loginRoute(app, accounts_db);
};
