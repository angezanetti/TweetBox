TWEET BOX
=================

The TweetBox is a simple tool for coworking spaces

Usage
-----

The first version of the tweetbox is pretty easy to use. 
There is one potentiometer & one push button.

Turn the potentiometer to select the statut you want to tweet, push the button to send it to your account.

Server Request
--------------

The REST API is implemented to dialog with the NodeJs tweetbox server. 

Here is how to use it : 

GET /status/ 		to get the list of the status
GET /status/id		to get the status with the id 
					with Accepts set to HTML you'll receive the whole status, with plain text you'll receive a keyword
GET /signal/id 		to send to twitter API the status
POST /status/id 	to update a status in the JSON list
DEL /status/id 		to delete a status in the JSON list

Bug Tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/angezanetti/tweetBox/issues



Developers
----------

We have included a makefile with convenience methods for working with the bootstrap library.

+ **build** - `make build`
This will run the less compiler on the bootstrap lib and generate a bootstrap.css and bootstrap.min.css file.
The lessc compiler is required for this command to run.

+ **watch** - `make watch`
This is a convenience method for watching your less files and automatically building them whenever you save.
Watchr is required for this command to run.


AUTHORS
-------

**Xavier Coiffard**

+ http://twitter.com/angezanetti
+ http://github.com/angezanetti

**Guillaume Laboure**

+ http://twitter.com/guitool
+ http://github.com/guitool


Copyright and License
---------------------

Copyright (C) 2011  AngeZanetti, Guitool

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.