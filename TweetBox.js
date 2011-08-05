// // ///////////////////////////////////////////////////////////////////////////////// //
//  TweetBox, a nice Arduino box which can tweet throw a Node.js Server !				//
// Copyright (C) 2012  AngeZanetti - made with & @Guitool for CoworKingLille			//	
// 																						//
// This program is free software; you can redistribute it and/or						//	
// modify it under the terms of the GNU General Public License							//
// as published by the Free Software Foundation; either version 2						//
// of the License, or (at your option) any later version.								//
// 																						//
// This program is distributed in the hope that it will be useful,						//
// but WITHOUT ANY WARRANTY; without even the implied warranty of						//
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the						//
// GNU General Public License for more details.											//
// 																						//
// You should have received a copy of the GNU General Public License					//
// along with this program; if not, write to the Free Software							//
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.		//	
// //////////////////////////////////////////////////////////////////////////////////// //

// Tweetbox requires express & Tweasy to works. Install it with NPM
var express = require('express');
var sys = require('sys')
  , tweasy = require("tweasy")
  , OAuth = require("oauth").OAuth
  ;
var fs = require('fs');
var sys = require('sys');

// The Oauth values, you can found it on dev.twitter.com
var my_consumer_key="0";
var my_consumer_secret= "0"; 
var oauthConsumer = new OAuth(
    "http://twitter.com/oauth/request_token",
    "http://twitter.com/oauth/access_token", 
    my_consumer_key,  my_consumer_secret, 
    "1.0", null, "HMAC-SHA1");
var twitterClient = tweasy.init(oauthConsumer, {
  access_token : "0",
  access_token_secret : "0",
});
// Create the Node.js Server with express
var app = express.createServer(
      express.logger()
    , express.bodyParser()
 );

// When the client call the page:3000/var1
app.get('/:toto', function(req, res){ // we get the var, named it toto :)
    var toto = req.params["toto"];
	var status;
	// We get the date also to make our tweet unique - or sort of. To shunt the API limitations
	var time = new Date();
	
	// Use Tweasy to tweet easily. 
	time = time.getHours() + ":" + time.getMinutes();
	// We open & read the JSON file to get the status connected with the var
	fs.readFile('valeurPotentio.txt', function (err, data) {
	  	if (err) throw err;
	  	list = JSON.parse(data);
		status = list.cwlStatus[toto];
		
		twitterClient.updateStatus("[TestEnCours] " + "Il est " + time + ", " + status, 
		  function(er, resp){
		    // If it worked you get a nice "you tweet in your console"
			if (!er) {
		      sys.puts("you tweeted!")
		    }
			//Else you got a error message
			else {
				console.log(er);
				}
		  });
	});
	
    
	// The text diaplay on the webpage - totally unusefull !
	res.send('TweetBox rules ! ');
  
});
// Our server wait the connecitons on the 3000 port.
app.listen(3000);