var express = require('express');
var router = express.Router();
var User = require('../models/users');
/*Get users listing. */
router.get('/', function(req, res, next) {
	User.find(function(err, users) {
		if (err) {
			res.send(err);
			return;
		}
		res.json({message: users});
	});
});
/* Create users listing. */
router.post('/signup', function(req, res, next){
	var user = new User();

	user.username = req.body.username;
	user.password = req.body.password;

	user.save(function(err) {
		if (err) {
			res.send(err);
			return;
		}
		res.json({message: 'Signed Up!', data: user});
	});
});
/*Get single user */
router.get('/:user_id', function(req, res, next){
	User.findById(req.params.user_id, function(err, user){
		if (err) {
			res.send(err);
			return;
		}
		res.json(user);
	});
});
//Update user password
router.put('/:user_id', function(req, res, next){
	User.findById(req.params.user_id, function(err, user){
		if (err) {
			res.send(err);
			return;
		}

		user.password = req.body.password;

		user.save(function(err){
			if(err) {
				res.send(err);
			}
			res.json(user);
		});
	});
});
//Delete user
router.delete('/:user_id', function(req, res, next){
	User.findByIdAndRemove(req.params.user_id, function(err){
		if (err) {
			res.send(err);
		}
		res.json({message: 'User: was removed.'})
	});
});

module.exports = router;
