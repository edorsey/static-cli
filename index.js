var fs = require('fs'),
    async = require('async'),
    program = require('commander'),
    morph = require('morph'),
    yaml = require('js-yaml'),
    dataIn = "";

program
  .version('0.0.1')
  .option('-n, --name [nameAttribute]', 'Attribute to use to name the file')
  .option('-l, --location [./output]', 'Download images')
  .option('--debug', 'Debug output')
  .parse(process.argv);

if (!program.location) program.location = "./output";
if (program.location[program.location.length] != "/") program.location += "/";
if (program.location == "/") return console.log("Check your location fool");

process.stdin.resume();  
process.stdin.setEncoding('utf8');  
process.stdin.on('data', function(data) {  
  dataIn += data;
});

process.stdin.on('end', function() {
  var posts = JSON.parse(dataIn);
  console.log(posts.length);  
});
  
/*
async.eachLimit(results, 5, function(result, cb) {
  if (program.filter && result.name.toLowerCase().indexOf(program.filter) > -1) return cb();
  if (result.name) {
    var filename = morph.toDashed(result.name.replace(/\W/g, ' ').replace(/\s{2,}/g, ' ')),
        body = "",
        content;
    
    if (result.body) {
      body = result.body;
      delete result.body;
    }
    
    content = "---\r\n" + yaml.safeDump(result) + "\r\n---\r\n" + body;
        
    fs.writeFile(program.location + filename + ".md", content, function(err, result) {
      if (err) return console.log(err);
      cb(err, result);
    });
  }
});
*/

