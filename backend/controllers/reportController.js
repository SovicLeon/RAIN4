var ReportModel = require('../models/reportModel.js');

module.exports = {
  add: function (req, res) {
    const { photoId } = req.params;
    const { userId } = req.session;

    // Check if the user has already reportd the photo
    ReportModel.findOne({ postedBy: userId, reported: photoId }, (err, existingReport) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingReport) {
        return res.status(400).json({ error: 'You have already reported this photo' });
      }

      // Create a new report and save it
      var newreport = new ReportModel({ postedBy: userId, reported: photoId });

      newreport.save((err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        } else {
          return res.status(201).json({ message: 'Reported' });
        }
      });
    });
  }
};
