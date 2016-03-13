var express = require('express');
var router = express.Router();
var Images = require('../models/images');
var Users = require('../models/users');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var fs = require('fs-extra');
var easyimg = require('easyimage');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

router.post('/upload', multipartMiddleware, function(req, res, next) {
	var image = new Images();
    var file = req.files.file;
    var imageName = req.body.imageName;
    var tagsHolder = req.body.tags;
    var allTags = tagsHolder.split(/,| /);
    var tags = [];
    
    allTags = allTags.filter(emptyElements);
    allTags = allTags.filter(function(elem, pos) {
        return allTags.indexOf(elem) == pos;
    });

    for (k in allTags) {
        tags.push(allTags[k].trim());
    }

    var username = req.body.username;
    var date = getDateTime();
    var fileName = date + username + file.name;
    var user = req.body.id;
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../uploads/fullsize/" + fileName);
    var savePath = "/uploads/fullsize/" + fileName;  
    var thumbPath = "/uploads/thumb/" + fileName;  

    fs.rename(tempPath, targetPath, function(err) {
    	if (err){
        	console.log(err)
        } else {

        	image.img = savePath;
            image.thumb = thumbPath;
            image.user = user;
            image.tags = tags;
            image.name = imageName;

            //Prideti thumb adresa
        	image.save(function(err) {
        		if (err) {
        			res.sendStatus(500);
					return;
        		} else {
                    resizeImage(targetPath, fileName);
        			res.sendStatus(200);
        		}
        	});
        }
    });
});

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

router.get('/', function(req, res) {
    Images.find({user: req.headers['id']})
        .populate('user')
        .exec(function (err, images) {
            if (err) {
             res.send(err);
             return;
            }
            res.json({images: images});
        });
});

router.get('/ids', function(req, res) {
    Images.find({user: req.headers['id']})
        .populate('user')
        .exec(function (err, images) {
            if (err) {
             res.sendStatus(500);
             return;
            }
            var ids = [];
            for (key in images) {
                ids.push(images[key]._id);
            }
            res.json({ imageIds: ids});
        });
});

router.get('/:image_id', function(req, res) {
    Images.findOne({_id: req.params.image_id, user: req.headers['id']})
        .populate('user')
        .exec(function (err, image) {
            if (err) {
             res.send(err);
             return;
            }
            res.json({image: image});
        });
});

router.put('/:image_id', function(req, res) {
    if (req.body.name) {
        Images.findOneAndUpdate({_id: req.params.image_id}, {name: req.body.name}, function(err, img) {
            if (err) {
                res.sendStatus(500);;
            } else {
                res.sendStatus(200);
            }
        });    
    } else if (req.body.tag && !req.body.delete) {
        Images.findOneAndUpdate(
            {_id: req.params.image_id}, 
            {$addToSet: { 'tags' : req.body.tag }},{upsert:true}, 
            function(err, img) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
        });
    } else if (req.body.tags) {
        Images.findOneAndUpdate(
            {_id: req.params.image_id}, 
            {tags: req.body.tags}, 
            function(err, img) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
        });       
    } else if (req.body.delete) {
        Images.findOneAndUpdate(
            {_id: req.params.image_id}, 
            {$pull: { 'tags' : req.body.tag }}, 
            function(err, img) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
        });    
    }
    
});

router.delete('/:image_id', function(req, res) {
    Images.findByIdAndRemove(req.params.image_id, function(err, img) {

        var deletePath = path.join(__dirname, "../" + img.img);
        var thumbDeletePath = path.join(__dirname, "../" + img.thumb);
        var files = [deletePath, thumbDeletePath];
        
        delteFiles(files, function(err) {
            if (err) {
                console.log(err);
            }
        })

        if (err) {
            res.send(err);
        }

        res.json({message: 'Image: was removed.'})
    });
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    var min  = date.getMinutes();
    var sec  = date.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day  = date.getDate();

    return year + "-" + month + "-" + day + "-" + hour + "-" + min + "-" + sec;

}

function resizeImage(imagePath, fileName) {
    var targetPath = path.join(__dirname, "../uploads/thumb/" + fileName);
    easyimg.thumbnail({
        src: imagePath,
        dst: targetPath,
        width: 240, height: 200
    }).then(function(image){
        console.log('Resized: ' + image.width + ' x ' + image.height);
    }, function(err){
        console.log(err);
    });
}

function delteFiles(files, callback) {
    files.forEach(function(filePath){
        fs.unlink(filePath, function(err) {
            if(err) {
                callback(err);
                return;
            }
        })
    });
}

function emptyElements(value) {
  return value.length > 0;
}

module.exports = router;