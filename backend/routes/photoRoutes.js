var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');
var likeController = require('../controllers/likeController.js');
var commentController = require('../controllers/commentController.js');
var reportController = require('../controllers/reportController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
//router.get('/publish', requiresLogin, photoController.publish);
router.get('/:id', photoController.show);

router.post('/:photoId/comment', requiresLogin, commentController.create);

router.post('/:photoId/report', requiresLogin, reportController.add);

router.post('/', requiresLogin, upload.single('image'), photoController.create);

router.put('/:id', photoController.update);

router.delete('/:id', photoController.remove);

// Add the requiresLogin middleware to the like routes
router.post('/photos/:photoId/like', requiresLogin, likeController.add);
router.delete('/photos/:photoId/like', requiresLogin, likeController.remove);

module.exports = router;
