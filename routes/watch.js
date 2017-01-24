var express = require('express');
var router = express.Router();
var fs = require('fs');
var chokidar = require('chokidar');
var mime = require('mime');
var s3 = require('../aws');
var bucket = "restfulapiexamplebucket";
var util = require("util");



router.get('/', function(req, res, next)
{
    var watcher = chokidar.watch('../data', {
        persistent: true
    });

    watcher
        .on('add', function(path, stats) {
            //console.log('File' + path + 'has been added');
            var type = mime.lookup(path);
            addToBucket(path, type, bucket);
           // if (stats) console.log('File ' + path + 'changed size to ' + stats.size);
        })
        .on('change', function(path, stats) {
            //console.log('File' + path + 'has been changed');
            var type = mime.lookup(path);
            addToBucket(path, type, bucket);
        })
        .on('unlink', function(path, stats) {
           // console.log('File' + path + 'has been unlinked');
            deleteFromBucket(path);
        });
    res.render('watch', { title: 'File Storage' });
});


function addToBucket(path, mime, bucket)
{
    var split_path = path.split("/");
    var file_name = split_path[split_path.length - 1];

    fs.readFile(path, function (err, data)
    {
        params = {

            Body: data,
            Bucket: bucket,
            Key: file_name,
           // ContentType: mime,
            ContentType:  "image/png",
            ACL: 'public-read'
        };

        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
               // fs.unlink(path);
            }
        });
    });
}


function deleteFromBucket(path)
{
    var split_path = path.split("/");
    var file_name = split_path[split_path.length - 1];

    fs.readFile(path, function(err,data)
    {
        params = {Bucket: bucket, Key: file_name};

        s3.deleteObject(params, function(err, data)
        {
            if(err) {
                console.log(err);
            } else {
                //console.log("Deleted: " + bucket, data);
            }
        })
    })
}

module.exports = router;


