var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	image : [{ 
		type: Schema.Types.ObjectId, 
		ref: 'image'
	}],
	user: {
		type: Schema.Types.ObjectId, 
		ref: 'user',
		required: true
	}
})

module.exports = mongoose.model('category', categorySchema);