// // ///////////////////////////////////////////////////////////////////////////////////
//  TweetBox, a nice Arduino box which can tweet throw a Node.js Server !
// Copyright (C) 2012  CoworkingLille - @AngeZanetti & @Guitool
// 
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
// 
// ///////////////////////////////////////////////////////////////////////////////////

var express = require('express');
var sys = require('sys')
  , tweasy = require("tweasy")
  , OAuth = require("oauth").OAuth
  ;
// Les données necessaires pour l'Oauth Twitter
var my_consumer_key="5UfcPwbdONeSeGnm9ouw";
var my_consumer_secret= "5Ban3CJVuWcoKjiavaO5w8ZcW2hD4kxE7hhAnbn8c"; 

var oauthConsumer = new OAuth(
    "http://twitter.com/oauth/request_token",
    "http://twitter.com/oauth/access_token", 
    my_consumer_key,  my_consumer_secret, 
    "1.0", null, "HMAC-SHA1");
var twitterClient = tweasy.init(oauthConsumer, {
  access_token : "64672523-b4mon2mMfVTomqSSigMDTOxX3tUaX9k0IrR4QtPCr",//my_users_access_token,
  access_token_secret : "B84lpdrf9mjf0MvOIBaIZJOG382ghtnNYWryKOl6g",//my_users_access_token_secret
});
// Lancement du serveur Node.js
var app = express.createServer(
      express.logger()
    , express.bodyParser()
 );

var tweetJSON = {"ArduinoVar": [
        "L'espace de #CoworkingLille est ouvert ! ",
		"Le café du #CoworkingLille est pret ! ",
		"Période de concentration profonde au #CoworkingLille",
		"Musique et ambiance festive ! #coworkinglille", 
		"C'est l'heure de l'apéro... Envie d'un verre ? #coworkinglille", 
		"On déjeune ? Qui vient Coluncher ce midi ! #coworkinglille",
		"Ouverture de la session Atelier. #coworkinglille",
		"On a bien bossé, on ferme ! On se voit demain ? #coworkinglille"
	    ]
};

//On repuère les params 
app.get('/:toto', function(req, res){ // rajouter /:tata si besoin d'une deuxième var	
    //console.log(req);
    var toto = req.params["toto"];
    console.log(toto);
	// On récupère le statut correspondant à la valeur du param
	//var status = JSON.parse(tweetJSON); Parser que si on importe le fichier
	var status = tweetJSON.ArduinoVar[toto];
	// Fonction qui permet de twitter
	var time = new Date();
	time = time.getHours() + ":" + time.getMinutes();
    twitterClient.updateStatus("[TestEnCours] " + "Il est " + time + ", " + status, 
	  function(er, resp){
	    // Si ça passe on confirme l'nvoi du tweet
		if (!er) {
	      sys.puts("you tweeted!")
	    }
		//Sinon message err
		else {
			console.log(er);
			}
	  });
	// Message affiché HTML
	res.send('hello world');
  
});
// Le serv écoute sur le port 3000
app.listen(3000);