
module.exports = function(app, express) { 

  const router = express.Router();
  let getUserController = require('../controllers/getUser');
  let getMediaDetailsController = require('../controllers/getMediaDetails')
  
  app.post('/getUsers', getUserController.getUser);
  app.post('/getMedia', getMediaDetailsController.getMediaDetails);

  app.post('/test', getUserController.getMessage);

}
