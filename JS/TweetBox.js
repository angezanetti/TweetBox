/*
 TweetBox
 

 created 2011
 by AngeZanetti <@AngeZanetti> 
 for CoWorkingLille <http://coworkinglille.com>

licenced under GNU/GPL v2
*/

// Tweetbox requires express & Tweasy to works. Install it with NPM
var express = require('express');
var sys = require('sys');
var fs = require('fs');
var parseStatus = require('./parseStatus');
var tweet = require('./tweet');
var http = require('http');

var app = express.createServer(
       express.logger()
     , express.bodyParser()
);

//// GET Method 

// Case of you want the status with the ID you passed in params
app.get('/status/:id', function(req, res){ 					

	if (req.accepts('text/html')){
    // With HTML you get the whole status
    // take the id from params - thx Express :p
    // then use the parseStatus method created in the parseStatusFile
    
		var id = req.params["id"];
		var update = parseStatus(id, 'html', 'get');
		console.log('status =====' + update);
		res.send('liste Status');
	}
	else if (req.accepts('text/plain')) {
    // in text plain mode you'll get one keyword only
    
		var id = req.params['id'];
		var update = parseStatus(id, 'text/plain', 'get');
		console.log('text' + update);
		res.send('keywords ');
	}
	else {
    // if you're not asking some HTML or Text, then you'll receive an error
		res.send('Not Supported format');					
	}
});

app.get('/status/', function(req, res){						
  // Without any id you receive the whole list
  
	if (req.accepts('application/json')) {
		var update = parseStatus(null, 'application/json', 'get');
		console.log('text' + update);
		res.send(JSON.parse(update));
	}
});

app.get('/signal/:id', function(req, res){
  // a Get on /signal/id will tweet the status number id
  // first we get the status
  // then we tweet it !
  
	var id = req.params['id'];
	var update = parseStatus(id, 'html', 'get');			
	tweet(update);											
	res.send('status tweeted !');
});

app.get('/member/:id', function(req, res){ 
  // a Get on /member/id will display the first name & the number of tickets left
  // Request on the externatl web service
  
	var id = req.params['id'];
    var options = {
        host: 'http://coworkinglille.com/simpleticket/home/rfid_data',
        port: 80,
        path: '/'+ id
    };

    // Parse the response & send it to the arduino board
    http.get(options, function(res) {
    }).on('error', function(e) {
        console.log("Got response: " + res.statusCode);
        console.log("Got error: " + e.message);
    });
    var firstName = res.statusCode.nom;
    var checkOut = res.statusCode.solde;
    res.send(res.statusCode.nom + ',' + res.statusCode.solde);
});

// 
// @TODO
//  The DEL status don't works 
//
app.del('/status/:id', function(req, res){
	var id = req.params['id'];
	var update = parseStatus(id,'text/plain', 'del');
	res.send('status deleted !');
});


//// POST Method 

app.post('/status/:id/:newStatus/:newKey', function(req, res){ 
	// Update the statut
	var id = req.params["id"];
	var newStatus = req.params["newStatus"];
	var newKey = req.params["newKey"];
	
	var update = parseStatus(id, 'html', 'post', newStatus, newKey);
	res.send('post method ' + update);
  	console.log("status update")
});


//// PUT Method 
// app.put('/signal/:id', function(req, res){
// 	var id = req.params["id"];
// 	var update = parseStatus(id, 'html');
// 	tweet(update);
// });

// Our server wait the connecitons on the 3000 port.
app.listen(3000);
console.log('Express app started on port 3000');
