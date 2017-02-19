var fs = require('fs');
var cssFolder = './saved_files/css';
var scrape = require('website-scraper');
var express = require('express');
var rimraf = require('rimraf');
var css_file = [];
var css_filedata = [];
var colors_ar = [];
var color_exp = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

var app = express();
var server = app.listen(8000, function(){
  console.log("listening on port 8000");
});
app.use(express.static("public"));

//HAVE TO USE BODY PARSER TO MAKE A POST REQUEST
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extented: true
}));

//GETTING THE URL FROM FRONTEND
app.post("/scrapecolor/", readyDir);

function readyDir(request, response){
  rimraf('/Users/shivanku/Documents/DWD/scraping_test/saved_files', function(){
     scrapeColor(request, response);
  });
}
function scrapeColor(request, response){
  scrape({
    urls: [request.body.url],
    directory: '/Users/shivanku/Documents/DWD/scraping_test/saved_files',
    sources: [
      {selector: 'link[rel="stylesheet"]', attr: 'href'}
    ]
  }, function(error, result){
    if(error){
      console.log(error);
    }
    else{
      css_file = [];
      css_filedata = [];
      colors_ar = [];
      //READ FILE NAMES OF CSS FILES THAT ARE SAVED
      fs.readdir(cssFolder, (err, files) => {
        files.forEach(file => {
          css_file.push(file);
        });
        var reply = readColors();
        response.send(reply);
      });
    }
  })
}

function readColors(){
  var colors_data;
  for(i = 0 ; i < css_file.length ; i++){
    css_filedata[i] = fs.readFileSync("saved_files/css/" + css_file[i], "utf8");
    colors_data = css_filedata[i].match(color_exp);
    if(colors_data){
      cleanColors(colors_data);
    }
  }
  return {colors : colors_ar};
}

function cleanColors(colors_data){
  for(j = 0; j < colors_data.length ; j++){
    if(colors_ar.indexOf(colors_data[j]) == -1){
      colors_ar.push(colors_data[j]);
    }
  }
}
