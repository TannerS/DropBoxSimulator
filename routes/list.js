var express = require('express');
var router = express.Router();
var fs = require('fs');
var chokidar = require('chokidar');
var mime = require('mime');
var s3 = require('../aws');
var bucket = "restfulapiexamplebucket";
var util = require("util");


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
    next();
});

router.get('/', function(req, res, next)
{
    var params = {
        Bucket: bucket
    };

    s3.listObjects(params, 	function(err, data)
    {
        for(var i = 0; i < data.Contents.length; i++)
        {
            data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
        }
        res.send(data.Contents);
    });
});

module.exports = router;