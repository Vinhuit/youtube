var express = require('express');
var partials = require('express-partials');
var app = express();
var port = process.env.PORT || 4000;
var sys = require('sys')
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
function puts(error, stdout, stderr) { sys.puts(stdout) }

var execSync = require('child_process').execSync;


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.static(__dirname + '/public'));

// Root page
app.get('/', 
function(req, res) {
  res.render('index');
});
app.get('/stream', 
function(req, res) {
  var link = req.query.link;
  var key = req.query.key;
  var cmd = "bash stream.sh " + key + " " + link +"";
  console.log(cmd);
  console.log("Đã Live Tắt trinh duyệt đi !! chờ tầm 3,4 p tự Live");
  //exec(cmd,{
   // maxBuffer: Infinity //quick fix
   // },puts);
  var proc = spawn('sh',['stream.sh','key','link',{
  cwd: process.env.HOME + '/app',
  env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
});


proc.on("exit", function(exitCode) {
    console.log('process exited with code ' + exitCode);
});

proc.stdout.on("data", function(chunk) {
    console.log('received chunk ' + chunk);
});

proc.stdout.on("end", function() {
    console.log("finished collecting data chunks from stdout");
});
 // exec(cmd, puts);
});
app.get('/streamoff',
function(req, res) {
  var cmd = "pkill ffmpeg && pkill youtube-dl";
  exec(cmd, puts);
});
app.get('/host', 
function(req, res) {
  exec("bash stream.sh 468 https://www.youtube.com/watch?v=mn1nWOOMH9E", puts);
});
app.get('/view', 
function(req, res) {
  res.render('view');
});

app.listen(port);
console.log('Server is listening on ' + port);
