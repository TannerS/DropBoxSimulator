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
    console.log("DEBUG");

    var params = {
        Bucket: bucket
    };

    s3.listObjects(params, 	function(err, data)
    {
        console.log("DEBUG1");

        for(var i = 0; i < data.Contents.length; i++)
        {    console.log("DEBUG2");

            data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
        }
        res.send(data.Contents);
    });

   // res.render('list', { title: 'Files' });
});

module.exports = router;