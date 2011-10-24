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

app.get('/status/:id', function(req, res){ 					// Case of you want the status with the ID you passed in params

	if (req.accepts('text/html')){							// With HTML you get the whole status
		var id = req.params["id"];							// take the id from params - thx Express :p
		var update = parseStatus(id, 'html', 'get');		// then use the parseStatus method created in the parseStatusFile
		console.log('status =====' + update);
		res.send('liste Status');
	}
	else if (req.accepts('text/plain')) {					// in text plain mode you'll get one keyword only
		var id = req.params['id'];
		var update = parseStatus(id, 'text/plain', 'get');
		console.log('text' + update);
		res.send('keywords ');
	}
	else {
		res.send('Not Supported format');					// if you're not asking some HTML or Text, then you'll receive an error
	}
});
app.get('/status/', function(req, res){						// Without any id you receive the whole list
	var update = parseStatus('rien', 'text/plain', 'get');	
	console.log('text' + update);
	res.send('keywords ');
});

app.get('/signal/:id', function(req, res){ 					// a Get on /signal/id will tweet the status number id
	var id = req.params['id'];
	var update = parseStatus(id, 'html', 'get');			// fisrt we gotta get the status
	tweet(update);											// then we tweet it !
	res.send('status tweeted !');
});

app.get('/member/:id', function(req, res){ 					// a Get on /member/id will display the first name & the number of tickets left
	var id = req.params['id'];
    // Request on the externatl web service
    var options = {
        host: 'http://coworkinglille.com/simpleticket/home/rfid_data',
        port: 80,
        path: '/'+ id
    };
    // Parse the response & send it to the arduino board
    http.get(options, function(res) {
        console.log("Got response: " + res.statusCode);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    var firstName = res.statusCode.nom;
    var checkOut = res.statusCode.solde;
    res.send(res.statusCode.nom + ',' + res.statusCode.solde);
});

// LE DEL passe pas ..... 
app.del('/status/:id', function(req, res){ 					// To delete a status in the JSON
	// On efface le statut correspondant  ---- UTILE ??? 
	console.log('del state');
	var id = req.params['id'];
	var update = parseStatus(id,'text/plain', 'del');
	res.send('status deleted !');
});


//// POST Method 

app.post('/status/:id/:newStatus/:newKey', function(req, res){ // To update a status in the JSON
	//-- Upadate le statut
	var id = req.params["id"];
	var newStatus = req.params["newStatus"];
	var newKey = req.params["newKey"];
	
	var update = parseStatus(id, 'html', 'post', newStatus, newKey);
	res.send('post method ' + update);
  	console.log("MaJ d'un statut")
});


//// PUT Method 
// app.put('/signal/:id', function(req, res){
// 	var id = req.params["id"];
// 	var update = parseStatus(id, 'html');
// 	tweet(update);
// });

// Our server wait the connecitons on the 3000 port.
app.listen(3000);
console.log('Express app started on port 3030');
