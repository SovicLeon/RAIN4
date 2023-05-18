var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var reportSchema = new Schema({
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'reported' : {
		type: Schema.Types.ObjectId,
		ref: 'photo'
   	}
});

module.exports = mongoose.model('report', reportSchema);
