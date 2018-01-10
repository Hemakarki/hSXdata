
module.exports = function(app, express) { 

  const router = express.Router();
  let adminController = require('../controllers/admin/admin');
  let subscriptionController = require('../controllers/subscription/subscription');
  let getUserController = require('../controllers/apis/getUser');
  let getMediaInsightController = require('../controllers/apis/getMediaInsight')
  let getBestFollowerController = require('../controllers/apis/getBestFollower');
  let getHistoryDetailsController = require('../controllers/apis/getHistoryDetails');
  let getSecretAdmirersController = require ('../controllers/apis/getSecretAdmirers');
  let discoverUsersController = require('../controllers/apis/discoverUsers');

  // admin routes
  app.post('/login', adminController.login);
  app.post('/signup', adminController.signup);
  app.get('/getUser/:id',adminController.getUser);
  app.get('/getAllUsers',adminController.getAllUsers);

  //subscription routes
  app.get('/getAllSubscriptions', subscriptionController.getAllSubscriptions);
  app.get('/getSubscriptionById/:id',subscriptionController.getSubscriptionById);
  app.post('/addSubscription',subscriptionController.addSubscription);
  app.put('/updateSubscription/:id',subscriptionController.updateSubscription);
  app.delete('/removeSubscription/:id', subscriptionController.removeSubscription);
  
  // instagram apis routes
  app.post('/getUserDetail', getUserController.getUserDetail);
  app.post('/UserDetail', getUserController.UserDetail);
  app.post('/mediaDetails', getUserController.mediaDetails);
  app.post('/mediaLike', getUserController.mediaLike);
  app.post('/getMediaInsight', getMediaInsightController.getMediaDetails);
  app.post('/getBestFollower',getBestFollowerController.getBestFollower);
  app.post('/getHistoryDetails',getHistoryDetailsController.getHistoryDetails);
  app.post('/getSecretAdmirers',getSecretAdmirersController.getSecretAdmirers);
  app.post('/discoverUsers',discoverUsersController.discoverUsers);
  

}
