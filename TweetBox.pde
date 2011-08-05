/*
 TweetBox
 

 created 2011
 by Guitool <@Guitool>
 for CoWorkingLille <http://coworkinglille.com>
 */
#if defined(ARDUINO) && ARDUINO > 18
#include <SPI.h>
#endif
#include <Ethernet.h>
#include <EthernetDHCP.h>
#include <EthernetDNS.h>
#include <Twitter.h>

// Function header
const char* ip_to_str(const uint8_t*);
void OutputIpAdress();

// Automat States
typedef enum {
  TBInitialization,
  TBReady,
  TBRequestTweet,
  TBTweeting,
  TBTweeted
} _states;


const int buttonPin 		= 2;      // pushbutton pin number
const int ledYellowPin 		= 6;      // yellow led pin number
const int ledRedPin 		= 5;      // red led pin number
const int potentiometerPin	= A0;	  // potentiometer analog port

const char* events[8] = {"L'espace est ouvert !\0",
                        "Le café du Coworking est pret.\0",
                        "Période de concentration profonde au Cowork\0",
                        "Musique et ambiance festive !\0",
                        "C'est l'heure de l'apéro... Envie d'un verre ?\0",
                        "On déjeune ? Qui vient Coluncher ce midi !\0",
                        "Ouverture de la session Atelier.\0",
                        "On a bien bossé, on ferme ! On se voit demain ?"};
                        
// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status
int oldeventSelection = 0;
                        
String tweetMessage;


byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte server[] = { 192,168,1,110 }; // HTTP Local Server !

Twitter twitter("Your Authorization token here");
Client client(server, 3000);

/*
 * Setup
 */
void setup() {
  // initialize the LED pin as an output:
  pinMode(ledYellowPin, OUTPUT);      
  pinMode(ledRedPin, OUTPUT);      
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);  
  // Serial communication for Debug
  Serial.begin(9600);  
  // Ethernet bootstrap
  Serial.println("Launching DHCP asynchronous request...");
  EthernetDHCP.begin(mac, 1);
}

/*
 *	Main Loop
 */
void loop(){
  ////////////////////////////////////////////////////////////////////////////////////////
  // ETHERNET State Polling
  static DhcpState prevState = DhcpStateNone;
  static unsigned long prevTime = 0;
  DhcpState state = EthernetDHCP.poll();
  if (prevState != state) {
    OutputIpAdress();
    prevState = state;
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////
  // HARDWARE Potentiometer Stuff
  buttonState = digitalRead(buttonPin);
  // Work on approx PI angle
  int potarLevel = analogRead(potentiometerPin);
  potarLevel = constrain(potarLevel, 75, 900);
  // Transform level to event array index
  int eventSelection = map(potarLevel, 70, 950, 0, 8);
  // Format Twitter message
  tweetMessage = events[eventSelection];
  tweetMessage.concat(" \n(");
  tweetMessage.concat(millis());
  tweetMessage.concat(")");
  // Debug output
  if(eventSelection != oldeventSelection) {
    Serial.print("Selected Message : ");
  	Serial.print(eventSelection);
  	Serial.print(" = (");
  	Serial.print(tweetMessage);
  	Serial.println(")");
  	oldeventSelection = eventSelection;
  }
  // Convert String to char array
  char pszTweetContent[146];
  tweetMessage.toCharArray(pszTweetContent, sizeof(pszTweetContent));
  
  ////////////////////////////////////////////////////////////////////////////////////////
  // TWITTER BUTTON
  if (buttonState == LOW) {
  	Serial.println("Pushed button state...");
    // turn LED on
    digitalWrite(ledRedPin, LOW);
    digitalWrite(ledYellowPin, HIGH);
    // Send Tweet
    if (client.connect()) {								// trying with the HTTP server...
		Serial.println("connected to the HTTP server...");
		// Make our HTTP request:
		String url = "GET /";
		url.concat(eventSelection);
		url.concat(" HTTP/1.0");
		Serial.println(url);
		// and send it to the HTTP server
		client.println(url);
		client.println();
		client.stop();
		// wait a litle bit in case the user fall asleep on the button ;)
		delay(800);
	} else {											// ... else fallback to tweeter API
		if (twitter.post(pszTweetContent) ) {
		  int status = twitter.wait();
		  if (status == 200) {
			  Serial.println("OK");
		  } else {
			  Serial.print("failed : code ");
			  Serial.println(status);
		  }
		} else {
		  Serial.println("connection failed.");
		}
	}
  } else {
    // Return to waiting state
    digitalWrite(ledYellowPin, LOW);
    digitalWrite(ledRedPin, HIGH);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
//

// Output IP Adress or DHCP Status
void OutputIpAdress()
{
  DhcpState state = EthernetDHCP.poll();
  switch (state) {
    case DhcpStateDiscovering:
      Serial.print("Discovering servers.");
      break;
    case DhcpStateRequesting:
      Serial.print("Requesting lease.");
      break;
    case DhcpStateRenewing:
      Serial.print("Renewing lease.");
      break;
    case DhcpStateLeased:
      Serial.println("Obtained lease !");
      const byte* ipAddr = EthernetDHCP.ipAddress();
      const byte* gatewayAddr = EthernetDHCP.gatewayIpAddress();
      const byte* dnsAddr = EthernetDHCP.dnsIpAddress();
      //EthernetDNS.setDNSServer(dnsAddr);
      // Debug output
      Serial.print("My IP address is ");
      Serial.println(ip_to_str(ipAddr));
      Serial.print("Gateway IP address is ");
      Serial.println(ip_to_str(gatewayAddr));
      Serial.print("DNS IP address is ");
      Serial.println(ip_to_str(dnsAddr));
      Serial.println();
      break;
  }
}

// Just a utility function to nicely format an IP address.
const char* ip_to_str(const uint8_t* ipAddr)
{
  static char buf[16];
  sprintf(buf, "%d.%d.%d.%d\0", ipAddr[0], ipAddr[1], ipAddr[2], ipAddr[3]);
  return buf;
}

