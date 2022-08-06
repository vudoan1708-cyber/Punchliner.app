module.exports = (app, accounts_db) => {
  app.get('/login', (req, res) => {
    
  });

  app.post('/register', (req, res, next) => {
    const USERNAME = req.query.username;
    const PASSWORD = req.query.password;
    console.log(USERNAME, PASSWORD);

    try {
      
    } catch (ex) {
      next(ex);
    }
  });
};
