var fs = require('fs');
var cssFolder = './saved_files/css';
var scrape = require('website-scraper');
var css_file = [];
var css_filedata = [];
var colors_ar = [];
var color_exp = /\s#[\d\w]+[\s;]/g;

scrape({
  urls: ['https://www.npmjs.com/package/website-scraper'],
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
      readColors();
    });
  }
})

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
