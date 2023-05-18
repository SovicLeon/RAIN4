var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'description' : String,
	'replyTo' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'photo'
	},
	'postedBy' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   	},
	'date' : Date
});

module.exports = mongoose.model('comment', commentSchema);