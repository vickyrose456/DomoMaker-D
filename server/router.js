const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // connect routes
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  // want to make sure login/signup is secure and logged out
  // so they cant try to login when logged in
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // make sure theyre logged in and cant logout if they arent logged in
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // make sure theyre logged in. otherwise they cannot reach page
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

  // app.get('/', controllers.Account.loginPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
