//twitter keys 
var twitterKeys = require('./keys.js');

//placeholder value
var twitter = require('twitter');

//make twitter object with keys to make calls
var tweets = new twitter(twitterKeys.twitterKeys);

//find parameter object
var twitterSearchParam = {
    screen_name: 'havamere',
    count: 20,
}

//general request variable
var request = require('request');

//allows access to the file system
var fs = require('fs');

//sets variable for arguments
var command = process.argv[2];

//sets variable to have acces to all other inputs as a parameter to the queries
var parameter = process.argv.slice(3).join('+');

//function for writing to txt.log
function writeToLog (textParam) {
    
    fs.appendFile('log.txt', textParam, function(err){
        
        if (err) {
            return console.log(err);
        };
        
        console.log('log.txt was updated');
    });
};

//logic to control what wappens based on user input
switch (command) {
    case 'my-tweets':
        getMyTweets();
    break;
    case 'spotify-this-song':
        getMusicInfo(parameter);
    break;
    case 'movie-this':
        getMovieInfo(parameter);
    break;
    case 'do-what-it-says':
        doSomethingRandom(parameter);
    break;
    
    default:
        console.log('That command was unrecognized. Try again.');
};

//placeholder for string variable to be written to log.txt
var writeableObj = "";

//gets last 20 tweets from user based on set parameters
function getMyTweets(){
    tweets.get('statuses/user_timeline', twitterSearchParam, function(err, response){
        
        if (err) {
            console.log(err);
        };
        
        console.log('This is my last '+response.length+' tweets.')
        
        for (var i = 0; i < response.length; i++) {
            
            console.log('#'+(i+1)+": "+response[i].text);
            console.log('Posted on: '+response[i].created_at);
            
            writeableObj += ', '+'#'+(i+1)+": "+response[i].text + response[i].created_at;
        };
    
    writeableObj = command +""+ writeableObj+"\n";
    
    writeToLog(writeableObj);
    });
};

//spotify function returns first match spotify finds to song parameter
function getMusicInfo(parameter){
    
    if (!parameter) {
        parameter = "what's+my+age+again";
    };

    //api query url for request, limits parameter search to trrack and limit of 5 song return
    var queryUrl = 'https://api.spotify.com/v1/search?q='+parameter+'&limit=5&type=track';

    //runs call to api
    request(queryUrl, function(err, response, body){
        
        if (err) {
            console.log(err);
        };
        
        body = JSON.parse(body);

        console.log('The 5 highest rated matchs for your search is:');
        for (var i = 0; i < body.tracks.items.length; i++) {
            
            console.log('Artist(s): '+body.tracks.items[i].artists[0].name);
            console.log('Song Title: '+body.tracks.items[i].name);
            console.log('Preview Link: '+body.tracks.items[i].preview_url);
            console.log('Album Name: '+body.tracks.items[i].album.name);
            
            writeableObj = command+", "+parameter+", "+body.tracks.items[i].artists[0].name+", "+body.tracks.items[i].name+", "+body.tracks.items[i].preview_url+", "+body.tracks.items[i].album.name+"\n"; 
        };
        
        writeToLog(writeableObj);
    });
};

//OMDB function
function getMovieInfo(parameter){
    
    if (!parameter) {
        parameter = 'Mr.nobody';
    };
    //URL OMD
    var queryUrl = 'http://www.omdbapi.com/?t=' + parameter +'&y=&plot=short&r=json&tomatoes=true';
    
    request(queryUrl, function(err, response, body){
        
        if (err) {
            console.log(err);
        } 
        
        body = JSON.parse(body);
        
        console.log('Title: '+ body.Title);
        console.log('Year released: '+ body.Year);
        console.log('IMDB rating: '+ body.imdbRating);
        console.log('Countries Released in: '+ body.Country);
        console.log('Languages Released in: '+ body.Language);
        console.log('Plot: '+ body.Plot);
        console.log('Actors: '+ body.Actors);
        console.log('Rotten Tomatoes Rating: '+ body.tomatoRating);
        console.log('Rotten Tomatoes URL: '+ body.tomatoURL);
         
        writeableObj = command+", "+parameter+", "+body.Title+", "+body.Year+", "+body.imdbRating+", "+body.Country+", "+body.Language+", "+body.Plot+", "+body.Actors+", "+body.tomatoRating+", "+body.tomatoURL+"\n";

        
        writeToLog(writeableObj);
    });
};

function doSomethingRandom(parameter){
    fs.readFile('random.txt', 'utf8', function(err, data){
        
        if (err){
            console.log(err);
        }
        
        var output = data.toString().split(',');
        
        command = output[0];
        parameter = output[1];
        
        
        switch (command) {
            case 'my-tweets':
                getMyTweets();
            break;
            case 'spotify-this-song':
                getMusicInfo(parameter);
            break;
            case 'movie-this':
                getMovieInfo(parameter);
            break;
            
            default:
                console.log('Command was unrecognized. Try again.');
        };
    });
};