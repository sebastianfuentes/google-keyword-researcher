"use strict"

const google = require('google');
const fs = require('fs');
const url = require('url');
const exportData = require('./exportData');

let formatedResults = [];
let rankedResults = [];
let removeDomainChars = /\bpr\b|\bes\b|\ben\b|\bwww\b|\bin\b|\bcom\b|\bco\b|\buk\b|\bmx\b|\bnet\b|\borg\b|\bedu\b|\bit\b|\bbr\b|\bus\b|\bninja\b|\bme\b|\btv\b|\./ig;

google.tld = process.argv[2] || ".com.mx";
google.lang =  process.argv[3] || "es";
google.resultsPerPage = 10;
google.nextText = google.lang == "en" ? "Next" : "Siguiente"


// scrape the results from google for each keyword
exports.searchInGoogle = (queries) => {
	let time = 0;
	let lookup = [];
	for(let query of queries){
		let promise = new Promise((resolve,reject) => {
			setTimeout((query) => {
				google(query, (err, res) => {
					if (err) console.error(err)
					console.log(`Looking up ${query}`);
					resolve(res);
				});
			}, time, query.keyword);
			// delay time to avoid google from blocking the ip
			time += 20000;
		});
		lookup.push(promise);
	}
	Promise.all(lookup).then((res) => {
		this.saveResults(res);
	})
	.catch((err)=>{
		console.log(err);
	});
	console.log("Keywords Searched, starting saving them")
}
// clean and save the file with all the search results and positions
exports.saveResults = (results) => {
	for (let i = 0; i < results.length; i++) {
		let result = {
			Keyword: results[i].query,
			MarketShare:results[i].links
		}
		for (let j = 0; j < result.MarketShare.length; j++) {
			let page = result.MarketShare[j];
			if (page.title.match(/(images|im[A-zÀ-ú]genes)\s(.*)\s/ig)) page.title = "Google Images";
			if (page.title.match(/(news|noticias)\s(.*)\s/ig)) page.title = "Google News";
			else if (!page.title){
				console.log(page.title)
				continue;
			}
			else {
				console.log(page)
				let newTitle = page.link ? url.parse(page.link) : page.link;
				newTitle = newTitle.host
					.replace(removeDomainChars, " ")
					.trim();
				page.title = newTitle.replace(/\b\w/g, l => l.toUpperCase());
			}
			page.position = j+1;
			rankedResults.push(page);
		}
		result.MarketShare = rankedResults;
		rankedResults = [];
		formatedResults.push(result);
	}
	fs.writeFile("./json/results.json", JSON.stringify(formatedResults, "", "\t") , (err) => {
	    if(err) return console.log(err);
	    console.log("The file was saved, started matching results with market share");
	});
	exportData.cleanResults("./json/results.json")
}