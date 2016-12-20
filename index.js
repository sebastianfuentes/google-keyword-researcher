'use strict'

const google = require('google');
const fs = require('fs');
const url = require('url');

// let results = require('./results.json');
let formatedResults = [];
let rankedResults = [];
let removeDomainChars = /\bpr\b|\bes\b|\ben\b|\bwww\b|\bin\b|\bcom\b|\bco\b|\buk\b|\bmx\b|\bnet\b|\borg\b|\bedu\b|\bit\b|\bbr\b|\bus\b|\bninja\b|\bme\b|\btv\b|\./ig;

let queries = ['fondos de pantalla', 'mejores celulares', 'moto z', 's7 edge'];

google.tld = process.argv[2] || ".com.mx";
google.lang =  process.argv[3] || "es";
google.resultsPerPage = 10;

function saveResults(results){
	for (let i = 0; i < results.length; i++) {
		let result = {
			Keyword: results[i].query,
			MarketShare:results[i].links
		}
		for (let j = 0; j < result.MarketShare.length; j++) {
			let page = result.MarketShare[j];
			if (page.title.match(/(images|imagenes)\s(.*)\s/ig) || page.link == null) page.title = "Google Images";
			else {
				let newTitle = url.parse(page.link);
				newTitle = newTitle.host.replace(removeDomainChars, "");
				page.title = newTitle.replace(/\b\w/g, l => l.toUpperCase());
			}
			page.position = j+1;
			rankedResults.push(page);
		}
		result.MarketShare = rankedResults;
		rankedResults = [];
		formatedResults.push(result);
	}
	fs.writeFile("./results.json", JSON.stringify(formatedResults, "", "\t") , (err) => {
	    if(err) return console.log(err);
	    console.log("The file was saved!");
	});
}

function searchInGoogle(queries){
	let time = 0;
	let lookup = [];
	for(let query of queries){
		let promise = new Promise((resolve,reject) => {
			setTimeout((query) => {
				google(query, (err, res) => {
					if (err) console.error(err)
					resolve(res);
				});
			}, time, query);
			// time += 15000;
			time += 7000;
		});
		lookup.push(promise);
	}

	Promise.all(lookup).then((res) => {
		saveResults(res);
	})
	.catch((err)=>{
		console.log(err);
	});
}

// saveResults(results);
searchInGoogle(queries);