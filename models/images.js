var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = Schema({
	name: {
		type: String,
		required: true
	},
	img: {
		type: String,
		required: true	
	},
	thumb: String,
	user : { 
		type: Schema.Types.ObjectId, 
		ref: 'user'
	},
	tags: []
});

module.exports = mongoose.model('image', imageSchema);