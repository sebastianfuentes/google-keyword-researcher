"use strict"

const csv2json = require('csv2json');
const fs = require('fs');
const search = require('./search.js');

exports.init = (file = 'keywords.csv', newFile = false) =>{
	// default parameters in case csv is already parsed
	if (newFile) {
		// read the csv and parse it to json
		fs.createReadStream(file)
			.pipe(csv2json({
				// Defaults to comma. 
				separator: ','
			}))
			.pipe(fs.createWriteStream('keywords.json'))
			.on('finish',() => {
				// if finished parsing read the json into a variable
				this.readJson('./keywords.json');
			});
	} else this.readJson('./keywords.json');
	// if json already parsed just read it
};

exports.readJson = (file) => {
	// read the json and remove al non useful parameters
	fs.readFile(file, 'utf8',(err, data) => {
	  if (err) throw err;
	  this.cleanKeywords(JSON.parse(data));
	});
};

exports.cleanKeywords = (keywords) => {
	let cleanKeywords = new Promise((resolve, reject) => {
		let cleanedKeywords = [];
		for(let keyword of keywords){
			// remove unuseful parameters
			let newKeyword = {
					keyword: keyword.Keyword,
					average: keyword['Avg. Monthly Searches (exact match only)']
			};
			// clean empty keywords or with less than 200 hundred monthly average searches
			if (newKeyword.average > 200 && newKeyword.keyword.length > 0 && !newKeyword.keyword.match(/\uFFFD/g)){
				cleanedKeywords.push(newKeyword);
			}
		}
		resolve(cleanedKeywords);
	});
	cleanKeywords.then((res) => {
		search.searchInGoogle(res);
		// start the search and save the cleaned keywords
		fs.writeFile("./cleanedJson.json", JSON.stringify(res, null, 2),(err) => {
	    if(err) return console.log(err);
			console.log("The cleaned keywords were saved!");
		});
	})
	.catch((err) => {
		console.log(err);
	});
};