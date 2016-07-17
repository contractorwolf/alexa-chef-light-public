// Alexa tell ChefLight to turn {on|off}

  console.log("ChefLight v0.1 Started");

  var request = require("request");

  console.log("require executed");

  var AlexaSkill = require('./AlexaSkill');
  var APP_ID = '[YOUR ALEXA SKILL APP ID]';
  var deviceId = '[YOUR SPARK CORE DEVICE ID]';
  var access_token = '[YOUR SPARK CORE ACCESS TOKEN]';

  var handleChefLightRequest = function(intent, session, response){
    var lightStatus  = intent.slots.lightStatus.value;
    var operateLight = false;
    var sparkFunction = "turnLedOff";

    if(lightStatus == "on"){
      sparkFunction = "turnLedOn";
      operateLight = true;
      console.log("calling: " + lightStatus);
    }else if(lightStatus == "off"){
      sparkFunction = "turnLedOff";
      operateLight = true;
      console.log("calling: " + lightStatus);

    }else if(lightStatus == "sirens"){
      sparkFunction = "basicSirens";
      operateLight = true;
      console.log("calling: " + lightStatus);

      //can only speak at the end, not midway through interaction
      //response.tell("alert, intruders detected");

    }else{
      response.tell("unknown light status: " + lightStatus);
      console.log("unknown light status: " + lightStatus);
    }

    var sparkUrl = 'https://api.spark.io/v1/devices/'+ deviceId +'/' + sparkFunction + '?access_token=' + access_token;

    if(operateLight){
      console.log('attempting to activate light');
      console.log('url: ' + sparkUrl);

      try {
        request.post({
          url: sparkUrl
        }, function(error, response2, body){
          if(error){
            console.log('Error:', error);
            response.tell("error: " + error);
          }else{
            if(lightStatus == "on"){
              response.tell("lights on");
            }else if(lightStatus == "off"){
              response.tell("lights off");
            }else if(lightStatus == "sirens"){
              response.tell("intruders detected, officers are currently responding to your location");
            }
          }
          console.log("response2: " + response2);
          console.log("body: " + body);

        });
      }
      catch(err) {
         console.log("err: " + err);
      }
    }
  };

  var ChefLight = function(){
    AlexaSkill.call(this, APP_ID);
  };

  ChefLight.prototype = Object.create(AlexaSkill.prototype);
  ChefLight.prototype.constructor = ChefLight;

  ChefLight.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session){
    // What happens when the session starts? Optional
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
  };

  ChefLight.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
    // This is when they launch the skill but don't specify what they want. ]
    var output = 'Welcome to Chef Light. Tell me if you want the Light to turn On or Off';
    var reprompt = 'Which should I do? say turn on or turn off';

    response.ask(output, reprompt);

    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  };

  ChefLight.prototype.intentHandlers = {
    ChefLightIntent: function(intent, session, response){
      handleChefLightRequest(intent, session, response);
    },

    HelpIntent: function(intent, session, response){
      var speechOutput = 'Get me to operate the Chef Light. Which should I do? say turn on or turn off';
      response.ask(speechOutput);
    }
  };

  exports.handler = function(event, context) {
      var skill = new ChefLight();
      skill.execute(event, context);
  };
