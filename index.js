var fs = require('fs'),
    async = require('async'),
    program = require('commander'),
    morph = require('morph'),
    yaml = require('js-yaml'),
    request = require('request'),
    moment  = require('moment'),
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
    result.name = result.name.replace('PDF', '').replace('Unabridged', '').trim();
    var filename = morph.toDashed(result.name.replace(/\W/g, ' ').replace(/\s{2,}/g, ' ').trim());
    if (result.releaseDate) result.releaseDate = moment(result.releaseDate, "MM-DD-YY").format("YYYY-MM-DD");
    if (result.purchaseDate) result.purchaseDate = moment(result.purchaseDate).format("YYYY-MM-DD");
    result.finishDate = result.purchaseDate || result.releaseDate;
    result.collection = "library";
    result.template = "book.html";
    result.reader = "edorsey";
    result.finished = true;
    if (result.image) {
      result.cover = result.image;
      result.cover = program.assets.replace("./", "/") + filename + ".jpg"
    }
    result.title = result.name;
    
    if (program.filter && result.name.toLowerCase().indexOf(program.filter) > -1) return cb();
    if (result.name) {
      var body = "",
          content;
      
      if (result.body) {
        body = result.body;
        delete result.body;
      }
      fs.exists(program.assets + filename + ".jpg", function(exists) {
        if (exists) {
          writeFile(filename, result, cb);
          return cb();
        }
        if (program.assets && result.image) {
          console.log("HERE", result.image)
          request(result.image)
            .on('end', function() {
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
      });
    }
  });
};

writeFile = function(filename, result, cb) {
  console.log("WRITE FILE", filename);
  var content, 
      body;
  
  fs.exists(program.location + filename + ".md", function(exists) {
    if (!exists) return cb();
    if (result.body) {
      body = result.body;
      delete result.body;
    }
    try {
      content = "---\r\n" + yaml.safeDump(result) + "---\r\n" + body + "\r\n";
      fs.writeFile(program.location + filename + ".md", content, function(err, result) {
        if (err) return console.log(err.stack);
        cb(err, result);
      });
    }
    catch(e) {
      console.log(result);
      console.log(e);
      console.log(e.stack);
    }
  });
}

