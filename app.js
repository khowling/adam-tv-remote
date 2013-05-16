
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , net = require('net')
  , spawn = require('child_process').spawn;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// connect to the lirc server
// var client = new net.createConnection(8765 , (process.env.LIRC_SERVER || 'localhost'),
//    function() { //'connect' listener
//  console.log('client connected');
  
  http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
    
//});
/*
client.on('data', function(data) {
  console.log(data.toString());
  //client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
client.on('error', function(err) {
  console.log('Socket Error :: ' + err);
});
*/

app.get('/send_once/:remote/:command/:count', function (req, res) {
    var remote = req.params.remote,
        command = req.params.command,
        count = req.params.count;
//    client.write('SEND_ONCE '+remote+' '+command+' '+count+'\n'); // \r
    res.send('send command');
    });


app.post ('/send_once', function (req, res) {
    var command = req.body.command,
        cmdobj = JSON.parse(command);
    console.log (command);
    
    for (i in cmdobj) {
        console.log('Loop : ' + i + ' : ' + cmdobj[i].device   + ' : ' + cmdobj[i].cmd  );
    }
        
});

app.get('/launchplayer', function (req, res) {
    var mplayer  = spawn('mplayer', [path.join(__dirname, 'public/media/')+'test1.mp4']);
    console.log('Spawned child pid: ' + mplayer.pid);
    
    mplayer.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });
    
    mplayer.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    mplayer.on('exit', function (code, signal) {
        console.log('child process terminated due to receipt of signal '+signal);
        res.send('send command');
    });
    
}); 
