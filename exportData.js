const fs = require('fs');
const json2csv = require('json2csv');
const _ = require("lodash");

exports.cleanResults = (file) => {
	const json = require(file);
	const market = require("./json/cleanedJson.json");
	const multipliers = {
		_1: .25,
		_2: .15,
		_3: .1,
		_4: .07,
		_5: .05,
		_6: .03,
		_7: .02,
		_8: .02,
		_9: .02,
		_10: .02,
		_11: .02,
		_12: .02,
	}
	var cleaned = json.map((elem,index)=>{
			var result = {
				Keyword: elem.Keyword,
				MarketShare: [],
				Searches: market[index].average
			}
			for (var i = 0; i < elem.MarketShare.length; i++) {
				if (elem.MarketShare[i].title != "Bug Page"){
					elem.MarketShare[i].position = i+1;
					elem.MarketShare[i]["visibility"] = market[index].average*multipliers[`_${elem.MarketShare[i].position}`];
					result.MarketShare.push(elem.MarketShare[i])
				}
			}
			return result;
	});
	fs.writeFile("./json/cleanedResults.json", JSON.stringify(cleaned, "", "\t") , (err) => {
	    if(err) return console.log(err);
	    console.log("The file with matched market share and google results is saved!");
	    console.log("Starting to move data to csv form");
	});
	this.cleanToCsv(cleaned);
};

exports.cleanToCsv = (json) => {
	const fields = [
			'Keyword', 
			'Searches', 
			"MarketShare._1.title", "MarketShare._1.visibility",
			"MarketShare._2.title", "MarketShare._2.visibility",
			"MarketShare._3.title", "MarketShare._3.visibility",
			"MarketShare._4.title", "MarketShare._4.visibility",
			"MarketShare._5.title", "MarketShare._5.visibility",
			"MarketShare._6.title", "MarketShare._6.visibility",
			"MarketShare._7.title", "MarketShare._7.visibility",
			"MarketShare._8.title", "MarketShare._8.visibility",
			"MarketShare._9.title", "MarketShare._9.visibility",
			"MarketShare._10.title", "MarketShare._10.visibility"
			];
	const fieldNames = ['Keyword', 'Average Monthly Searches', "Rank 1", "0.25", "Rank 2", "0.15", "Rank 3", "0.1", "Rank 4", "0.07", "Rank 5", "0.05", "Rank 6", "0.03", "Rank 7", "0.02", "Rank 8", "0.02", "Rank 9", "0.02", "Rank 10", "0.02"];
	var data = json.map((e)=>{
		var result = {
			Keyword: e.Keyword,
			MarketShare: {
				_1: null,
				_2: null,
				_3: null,
				_4: null,
				_5: null,
				_6: null,
				_7: null,
				_8: null,
				_9: null,
				_10: null
			},
			Searches: e.Searches
		}
		for (var i = 0; i < e.MarketShare.length; i++) {
			result.MarketShare[`_${i+1}`] = {
				title: e.MarketShare[i].title,
				visibility: e.MarketShare[i].visibility
			}
		}
		return result;
	});
	var csv = json2csv({ data: data, fields: fields, fieldNames: fieldNames});
	fs.writeFile('./csv/export.csv', csv, function(err) {
		if (err) throw err;
		console.log('Data exported to csv');
	});
	this.marketShare(json);
}

exports.marketShare = (json) => {
	var companies = json.map((elem)=>{
		return elem.MarketShare;
	});
	companies = [].concat.apply([], companies);
	
	var uniqCompanies =_.uniqBy(companies, function (e) {
		return e.title;
	});
	var totalVisits = require("./json/cleanedJson.json");

	totalVisits = Math.round((totalVisits.reduce((a, b)=> a + parseInt(b.average) , 0) * .73) * 100) / 100
	// var totalVisits = .reduce((a, b)=> a + b.average , 0);

	var MarketShare = uniqCompanies.map((e)=>{
		var object = {
			company: e.title,
			visits: 0,
			percentage: 0,
			website: e.link
		}
		for (var i = 0; i < companies.length; i++){
			if(e.title == companies[i].title){
				object.visits += companies[i].visibility;
			}
		}
		object.percentage = `${Math.round((object.visits/totalVisits * 100) * 100) / 100}%`;
		return object;
	});
	fs.writeFile('./data/MarketShare.json', JSON.stringify(MarketShare, "", "\t"), function(err) {
		if (err) throw err;
	});
	this.exportMarketShare(MarketShare);
};

exports.exportMarketShare = (MarketShare) => {
		const fields = [
			'company', 
			'visits',
			'percentage',
			'website',
			];
	const fieldNames = ['Company Name', "Visits", "Percentage", "Website"];
	var csv = json2csv({ data: MarketShare, fields: fields, fieldNames: fieldNames});
	fs.writeFile('./csv/MarketShare.csv', csv, function(err) {
		if (err) throw err;
		console.log('Data exported to csv');
	});
};