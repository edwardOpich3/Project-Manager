const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Login View
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // App View
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.post('/milestone', mid.requiresLogin, controllers.Domo.addMilestone);
  app.post('/requirement', mid.requiresLogin, controllers.Domo.addRequirement);
  app.post('/deleteProj', mid.requiresLogin, controllers.Domo.deleteProject);
  app.post('/settings', mid.requiresLogin, controllers.Account.settings);
};

module.exports = router;
