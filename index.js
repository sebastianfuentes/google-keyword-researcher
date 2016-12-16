'use strict'

const google = require('google');
const fs = require('fs');

google.resultsPerPage = 10;

let nextCounter = 0;

google('best smartwatches', (err, res) => {
	if (err) console.error(err)
		
	fs.writeFile("./document.html", res.body , (err) => {
	    if(err) return console.log(err);
	    console.log("The file was saved!");
	}); 
  // for (var i = 0; i < res.links.length; ++i) {
  //   var link = res.links[i];
  //   console.log(link.title + ' - ' + link.href)
  //   console.log(link.description + "\n")
  // }
});