var express = require('express');
var router = express.Router();
var likeController = require('../controllers/likeController.js');

// Requires user login for accessing the like routes
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page');
    err.status = 401;
    return next(err);
  }
}

// Add the requiresLogin middleware to the like routes
router.post('/photos/:photoId/like', requiresLogin, likeController.add);
router.delete('/photos/:photoId/like', requiresLogin, likeController.remove);

module.exports = router;
