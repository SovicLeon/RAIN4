var PhotoModel = require('../models/photoModel.js');
var LikeModel = require('../models/likeModel.js');

module.exports = {
    add: function(req, res) {
        const { photoId } = req.params;
        const { userId } = req.session;
    
        // Check if the user has already liked the photo
        LikeModel.findOne({ postedBy: userId, liked: photoId }, (err, existingLike) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
    
          if (existingLike) {
            return res.status(400).json({ error: 'You have already liked this photo' });
          }
    
          // Create a new like and save it
          var newLike = new LikeModel({ postedBy: userId, liked: photoId });
    
          newLike.save((err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
    
            // Increment the likes count of the photo
            PhotoModel.findByIdAndUpdate(
              photoId,
              { $inc: { likes: 1 } },
              { new: true },
              (err, photo) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
                if (!photo) {
                  return res.status(404).json({ error: 'Photo not found' });
                }
                return res.json({ message: 'Like added', photo });
              }
            );
          });
        });
      },

      remove: function(req, res) {
        const { photoId } = req.params;
        const userId = req.session.userId;  // Use session to get the logged-in user's ID
    
        // First, remove the Like record
        LikeModel.findOneAndDelete({ liked: photoId, postedBy: userId }, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            // Then, find the photo by its ID and decrement the likes count
            PhotoModel.findByIdAndUpdate(
                photoId,
                { $inc: { likes: -1 } },
                { new: true },
                (err, photo) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (!photo) {
                        return res.status(404).json({ error: 'Photo not found' });
                    }
                    return res.json({ message: 'Like removed', photo });
                }
            );
        });
    }
    
};
