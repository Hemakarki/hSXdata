
module.exports = function(app, express) { 

  const router = express.Router();
  let getUserController = require('../controllers/getUser');
  let getMediaInsightController = require('../controllers/getMediaInsight')
  let getBestFollowerController = require('../controllers/getBestFollower');
  let getHistoryDetailsController = require('../controllers/getHistoryDetails');

  app.post('/getUsers', getUserController.getUser);
  app.post('/getMediaInsight', getMediaInsightController.getMediaDetails);
  app.post('/getBestFollower',getBestFollowerController.getBestFollower);
  app.post('/getHistoryDetails',getHistoryDetailsController.getHistoryDetails);
  
  app.post('/test', getUserController.getMessage);

}
