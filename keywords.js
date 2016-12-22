"use strict"

const csv2json = require('csv2json');
const fs = require('fs');
const search = require('./search.js');

exports.init = (file = 'keywords.csv', newFile = false) =>{
	if (newFile) {
		fs.createReadStream(file)
			.pipe(csv2json({
				// Defaults to comma. 
				separator: ','
			}))
			.pipe(fs.createWriteStream('keywords.json'))
			.on('finish',() => {
				this.readJson('./keywords.json');
			});
	} else this.readJson('./keywords.json');
};

exports.readJson = (file) => {
	fs.readFile(file, 'utf8',(err, data) => {
	  if (err) throw err;
	  this.cleanKeywords(JSON.parse(data));
	});
};

exports.cleanKeywords = (keywords) => {
	let cleanKeywords = new Promise((resolve, reject) => {
		let cleanedKeywords = [];
		for(let keyword of keywords){
			let newKeyword = {
					keyword: keyword.Keyword,
					average: keyword['Avg. Monthly Searches (exact match only)']
			};
			if (newKeyword.average.length > 0 || newKeyword.average != "0" || newKeyword.keyword.length > 0){
				cleanedKeywords.push(newKeyword);
			}
		}
		resolve(cleanedKeywords);
	});
	cleanKeywords.then((res) => {
		search.searchInGoogle(res);
	})
	.catch((err) => {
		console.log(err);
	});
};

// exports.returnJson = (json) => {
// 	return json;
// };
