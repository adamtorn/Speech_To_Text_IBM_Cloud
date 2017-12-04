var path = require("path");
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var icecast = require('icecast');
var fs = require('fs');

/*
    sampleUrl = "http://stream.radioreklama.bg:80/nrj_low.ogg";
*/

module.exports = function( io ) {

    io.sockets.on("connection",function(socket){

        console.log('Socket.io Connection with the client established');

        socket.on('url', function(audioUrl){
            
            var speech_to_text = new SpeechToTextV1 ({
                username: 'XXX',
                password: 'XXX'
            });
            
            var params = {
                model: 'en-US_BroadbandModel',
                content_type: 'audio/mp3',
                'interim_results': true,
                'max_alternatives': 1,
                'word_confidence': false,
                timestamps: false,
                keywords: ['colorado', 'tornado', 'tornadoes'],
                'keywords_threshold': 0.5
            };
        
            // Create the stream.
            var recognizeStream = speech_to_text.createRecognizeStream( params );
            
            // Get strings instead of buffers from 'data' events.
            recognizeStream.setEncoding( 'utf8' );
        
            var onEvent = function( name, event ) {
                socket.emit( 'data', { name : JSON.stringify(event) } );
            };

            // Listen for events.
            //recognizeStream.on( 'results', function( event ) { onEvent( 'Results:', event ); } );
            recognizeStream.on( 'data', function( event ) { onEvent( 'Data:', event ); } );
            //recognizeStream.on( 'error', function( event ) { onEvent( 'Error:', event ); } );
            //recognizeStream.on( 'close', function( event ) { onEvent( 'Close:', event ); } );
            //recognizeStream.on( 'speaker_labels', function( event ) { onEvent( 'Speaker_Labels:', event ); } );
        
            // connect to the remote stream 
            icecast.get( audioUrl, function ( res ) {
            
                // log the HTTP response headers
                console.log( '--------------' );
                console.log( res.headers );
                console.log( '--------------' );
            
                res.pipe( recognizeStream );
            });
        
            // local file test
            //fs.createReadStream(path.join(__dirname+'/../routes/123.mp3')).pipe(recognizeStream);
        });
    });
}