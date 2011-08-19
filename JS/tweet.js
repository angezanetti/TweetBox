/*
 TweetBox
 

 created 2011
 by AngeZanetti <@AngeZanetti> 
 for CoWorkingLille <http://coworkinglille.com>

licenced under GNU/GPL v2
*/
var tweasy = require("tweasy");
var fs = require('fs');
var OAuth = require("oauth").OAuth;

module.exports = function(status) { 								// Module used to tweet the status


	fs.readFile('json/idTwitter.json', function (err, data) {
  		if (err) throw err;
  		idApi = JSON.parse(data);									// Get all the Oauth data from the JSON file
		var my_consumer_key = idApi.my_consumer_key;
		var my_consumer_secret = idApi.my_consumer_secret;
		var my_access_token = idApi.access_token;
		var my_access_token_secret = idApi.access_token_secret;
		
		var time = new Date();										// We get the date to make the tweet unique
		var hours = time.getHours();
		var minutes = time.getMinutes();
		if (minutes < 10) {
			minutes = "0" + minutes
		}
		time = hours + ":" + minutes;
		
		var oauthConsumer = new OAuth(
    	 	"http://twitter.com/oauth/request_token",
    	 	"http://twitter.com/oauth/access_token", 
   	 		my_consumer_key,  my_consumer_secret, 
     	 	"1.0", null, "HMAC-SHA1");
			twitterClient = tweasy.init(oauthConsumer, {			// use the tweasy lib to send it to the twitter API
   	 			access_token : my_access_token,
  				access_token_secret : my_access_token_secret,
			});
			twitterClient.updateStatus("Il est " + time + ", " + status, // We add the date to the status
		  	function(er, resp){
				if (!er) {
		      		console.log("you tweeted!")
		    	}
				else {
					console.log(er);
					}
		  	});
	});
};
