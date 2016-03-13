var express = require('express');
var router = express.Router();
var Category = require('../models/categories');
var jwt = require('jsonwebtoken');


router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    console.log("Token is:" + token);
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'superSecret', function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
        
    }
    
});

//Get All
router.get("/", function(req, res, next) {
	Category.find({user: req.headers['id']})
		.populate('user')
		.exec(function (err, categories) {
            if (err) {
             res.status(500);
             return;
            }
            res.json({categories: categories});
        });
});

//Create category
router.post("/add", function(req, res, next) {
	var category = new Category();

	category.name = req.body.name;
	category.user = req.body.id;
	category.save(function(err) {
		if (err) {
			res.send(err);
			return;
		}
		res.json({data: category});
	});

});

//Update category
router.put("/", function(req, res, next) {
	var error;
	req.body.categories.forEach(function(category) {
		Category.update({_id: category._id}, {$addToSet: { 'image' : req.body.imageId }}, {upsert: true}, function(err, category) {
			if (err) {
				console.log(err);
			}
		})
	});

	if (error) {
		console.log(error);
		res.sendStatus(500);
	} else {
		res.sendStatus(200);
	}

});

//Get imagesByCategory
router.get('/byCategory', function(req, res, next) {
    Category.findOne({name: req.headers['category-name'], user: req.headers['id']})
        .populate('image')
        .exec(function (err, category) {
            if (err) {
             res.send(err);
             return;
            }
            res.json({images: category.image});
        });
});

//Delete
router.delete('/:category_id', function(req, res) {
    Category.findByIdAndRemove(req.body.category_id, function(err, img) {
        if (err) {
            res.sendStatus(500);
        } else {
        	res.sendStatus(200);	
        }
    });
});

module.exports = router;