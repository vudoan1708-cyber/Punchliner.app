// configure the connection to MongoDB
import createConnection from "../data/connection";

// MongoDB database
import getAllData from "../logic/GetAllData";
import createData from "../logic/CreateData";
import updateData from "../logic/UpdateData";

// Login
import loginRoute from "../routes/login";

export default async (app) => {
  // configure the connection to MongoDB databases
  // 0 (accounts settings)
  // 1 (documents settings)
  const accounts_db = createConnection(0);
  const documents_db = createConnection(1);

  loginRoute(app, accounts_db);
};
