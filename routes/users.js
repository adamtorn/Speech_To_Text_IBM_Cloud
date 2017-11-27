var express = require('express');
var router = express.Router();

var icecast = require('icecast');

// URL to a known Icecast stream 
var url = 'http://secure.live-streams.nl:80/opus.opus';

/* GET users listing. */
router.get('/', function(req, res, next) {

  // connect to the remote stream 
  icecast.get(url, function (res) {
    
    // log the HTTP response headers
    console.log('--------------');
    console.log(res.headers);
    console.log('--------------');
  });

  res.send('respond with a resource');
});

module.exports = router;
