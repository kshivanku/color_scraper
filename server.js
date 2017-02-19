var fs = require('fs');
var cssFolder = './saved_files/css';
var scrape = require('website-scraper');
var express = require('express');
var css_file = [];
var css_filedata = [];
var colors_ar = [];
var color_exp = /\s#[\d\w]+[\s;]/g;

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
app.post("/scrapecolor/", scrapeColor);
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
  console.log(colors_ar);
  console.log(colors_ar.length);
  return {colors : colors_ar};
}

function cleanColors(colors_data){
  var color;
  for(i = 0; i < colors_data.length ; i++){
    color = colors_data[i].slice(1,colors_data[i].length - 1);
    if(colors_ar.indexOf(color) == -1){
      colors_ar.push(color);
    }
  }
}
