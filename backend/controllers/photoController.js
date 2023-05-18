var PhotoModel = require('../models/photoModel.js');
var LikeModel = require('../models/likeModel.js');  // Import the LikeModel at the top

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
            .populate('postedBy')
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }

                // Use the logged-in user's ID from the session
                const userId = req.session.userId;

                // For each photo, check if the user has liked it
                const photoPromises = photos.map(photo => {
                    return new Promise((resolve, reject) => {
                        LikeModel.findOne({ postedBy: userId, liked: photo._id }, (err, like) => {
                            if (err) {
                                reject(err);
                            } else {
                                // If a like exists, the user has liked the photo
                                const userHasLiked = Boolean(like);
                                console.log(photo._id);
                                console.log(userId);
                                // Add this info to the photo object
                                const photoWithLikeInfo = { ...photo._doc, userHasLiked };
                                resolve(photoWithLikeInfo);
                            }
                        });
                    });
                });


                // Wait for all promises to finish
                Promise.all(photoPromises)
                    .then(photosWithLikeInfo => res.json(photosWithLikeInfo))
                    .catch(err => res.status(500).json({ error: err.message }));
            });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id })
            .populate('postedBy')
            .exec(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }

                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                // Use the logged-in user's ID from the session
                const userId = req.session.userId;

                // Check if the user has liked the photo
                
                LikeModel.findOne({ postedBy: userId, liked: photo._id }, (err, like) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when checking like.',
                            error: err
                        });
                    }

                    // If a like exists, the user has liked the photo
                    const userHasLiked = Boolean(like);
                    // Add this info to the photo object
                    const photoWithLikeInfo = { ...photo._doc, userHasLiked };

                    return res.json(photoWithLikeInfo);
                });
            });
    },


    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
            name: req.body.name,
            path: "/images/" + req.file.filename,
            postedBy: req.session.userId,
            views: 0,
            likes: 0
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
            photo.path = req.body.path ? req.body.path : photo.path;
            photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
            photo.views = req.body.views ? req.body.views : photo.views;
            photo.likes = req.body.likes ? req.body.likes : photo.likes;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    }
};
