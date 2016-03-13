var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

userSchema.pre('save', function(next) {
	var user = this;
	if (user.isModified('password')) {
		bcrypt.hash(user.password, null, function(err, hash) {
			if (err) {
				next();
			}

			user.password = hash;
			next();
		});
	}
	next();
});

userSchema.methods.comparePassword = function(candidatePassword, done) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return done(err);
		done(null, isMatch);
 	});
};

module.exports = mongoose.model('user', userSchema);