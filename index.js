var fs = require('fs'),
    async = require('async'),
    program = require('commander'),
    morph = require('morph'),
    yaml = require('js-yaml'),
    request = require('request'),
    dataIn = "",
    writeFile,
    posts;

program
  .version('0.0.1')
  .option('-n, --name [nameAttribute]', 'Attribute to use to name the file')
  .option('-l, --location [./output]', 'Where to save post(s)')
  .option('-a, --assets [../images]', 'Where to save image(s)')
  .option('--debug', 'Debug output')
  .parse(process.argv);

var padDir = function(path) {
  if (path[path.length] != "/") path += "/";
  return path;
}

if (!program.location) program.location = "./output";
program.location = padDir(program.location)
if (program.assets) program.assets = padDir(program.assets);
if (program.location == "/" || program.assets == "/") return console.log("Check your location fool");

process.stdin.resume();  
process.stdin.setEncoding('utf8');  
process.stdin.on('data', function(data) {  
  dataIn += data;
});

process.stdin.on('end', function() {
  posts = JSON.parse(dataIn);
  console.log(posts.length);
  writeFiles(posts);
});
  
var writeFiles = function(posts) {
  async.eachLimit(posts, 5, function(result, cb) {
    if (program.filter && result.name.toLowerCase().indexOf(program.filter) > -1) return cb();
    if (result.name) {
      var filename = morph.toDashed(result.name.replace(/\W/g, ' ').replace(/\s{2,}/g, ' ')),
          body = "",
          content;
      
      if (result.body) {
        body = result.body;
        delete result.body;
      }
      
      if (program.assets && result.image) {
        console.log("HERE", result.image)
        request(result.image)
          .on('end', function() {
            result.image = program.assets.replace("./", "/") + filename + ".jpg"
            result.collection = "library";
            result.template = "book.html";
            result.reader = "edorsey";
            result.finished = true;
            result.cover = result.image;
            result.title = result.name;
            writeFile(filename, result, cb);
          })
          .on('error', function(err) {
            return cb(err);
          })
          .pipe(fs.createWriteStream(program.assets + filename + ".jpg"))
      }
      else {
        writeFile(filename, result, cb)
      }
    }
  });
};

writeFile = function(filename, result, cb) {
  var content, body;
  if (result.body) {
    body = result.body;
    delete result.body;
  }
  content = "---\r\n" + yaml.safeDump(result) + "---\r\n" + body;
  fs.writeFile(program.location + filename + ".md", content, function(err, result) {
    if (err) return console.log(err);
    cb(err, result);
  });
}

