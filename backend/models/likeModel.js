var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var likeSchema = new Schema({
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'liked' : {
		type: Schema.Types.ObjectId,
		ref: 'photos'
   	}
});

module.exports = mongoose.model('like', likeSchema);
