
module.exports = function(app, express) { 

  const router = express.Router();
  let getUserController = require('../controllers/getUser');
  let getMediaInsightController = require('../controllers/getMediaInsight')
  let getBestFollowerController = require('../controllers/getBestFollower');
  let getHistoryDetailsController = require('../controllers/getHistoryDetails');
  let getSecretAdmirersController = require ('../controllers/getSecretAdmirers');
  let discoverUsersController = require('../controllers/discoverUsers');

  app.post('/getUserDetail', getUserController.getUserDetail);
  app.post('/UserDetail', getUserController.UserDetail);
  app.post('/mediaDetails', getUserController.mediaDetails);
  
  app.post('/getMediaInsight', getMediaInsightController.getMediaDetails);
  app.post('/getBestFollower',getBestFollowerController.getBestFollower);
  app.post('/getHistoryDetails',getHistoryDetailsController.getHistoryDetails);
  app.post('/getSecretAdmirers',getSecretAdmirersController.getSecretAdmirers);
  app.post('/discoverUsers',discoverUsersController.discoverUsers);
  

}
