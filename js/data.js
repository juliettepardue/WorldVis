// data.js
// reading in data for world vis

var selected = 0;
var number_of_loaded_datasets=0;
var dataset = new Array(10);
var index_available = new Array(10);
var dataset_Continent = new Array(10);
var global_mean = new Array(10);
var subtypes = [];
var currentSubtypeSet = null;
var data_colors = d3.scale.category10();
var continents =["AF", "AS" ,"OC" ,"EU", "NA", "SA", "AN"];

var years_by_index = new Array(10);
var points_per_year = new Array(10);

var continent_selected = 0; //continent filter flag

//functions
var availableIndex, maxYearNum, maxYearIndex, yearNumForYear, yearForYearNum, yearIndexForYear, yearForYearIndex = [];

var list_Continent ={"DZA":"AF","AGO":"AF","SHN":"AF","BEN":"AF","BWA":"AF","BFA":"AF","BDI":"AF","CMR":"AF","CPV":"AF","CAF":"AF","TCD":"AF","COM":"AF","COG":"AF","DJI":"AF","EGY":"AF","GNQ":"AF","ERI":"AF","ESH":"AF","ETH":"AF","GAB":"AF","GMB":"AF","GHA":"AF","GNB":"AF","GIN":"AF","CIV":"AF","KEN":"AF","LSO":"AF","LBR":"AF","LBY":"AF","MDG":"AF","MWI":"AF","MLI":"AF","MRT":"AF","MUS":"AF","MYT":"AF","MAR":"AF","MOZ":"AF","NAM":"AF","NER":"AF","NGA":"AF","STP":"AF","REU":"AF","RWA":"AF","STP":"AF","SEN":"AF","SYC":"AF","SLE":"AF","SOM":"AF","ZAF":"AF","SHN":"AF","SDN":"AF","SWZ":"AF","TZA":"AF","TGO":"AF","TUN":"AF","UGA":"AF","COD":"AF","ZMB":"AF","TZA":"AF","ZWE":"AF","SSD":"AF","COD":"AF","AFG":"AS","ARM":"AS","AZE":"AS","BHR":"AS","BGD":"AS","BTN":"AS","BRN":"AS","KHM":"AS","CHN":"AS","CXR":"AS","CCK":"AS","IOT":"AS","GEO":"AS","HKG":"AS","IND":"AS","IDN":"AS","IRN":"AS","IRQ":"AS","ISR":"AS","JPN":"AS","JOR":"AS","KAZ":"AS","PRK":"AS","KOR":"AS","KWT":"AS","KGZ":"AS","LAO":"AS","LBN":"AS","MAC":"AS","MYS":"AS","MDV":"AS","MNG":"AS","MMR":"AS","NPL":"AS","OMN":"AS","PAK":"AS","PHL":"AS","QAT":"AS","RUS":"AS","SAU":"AS","SGP":"AS","LKA":"AS","SYR":"AS","TWN":"AS","TJK":"AS","THA":"AS","TUR":"AS","TKM":"AS","ARE":"AS","UZB":"AS","VNM":"AS","YEM":"AS","PSE":"AS","ASM":"OC","AUS":"OC","NZL":"OC","COK":"OC","FJI":"OC","PYF":"OC","GUM":"OC","KIR":"OC","MNP":"OC","MHL":"OC","FSM":"OC","UMI":"OC","NRU":"OC","NCL":"OC","NZL":"OC","NIU":"OC","NFK":"OC","PLW":"OC","PNG":"OC","MNP":"OC","SLB":"OC","TKL":"OC","TON":"OC","TUV":"OC","VUT":"OC","UMI":"OC","WLF":"OC","WSM":"OC","TLS":"OC","ALB":"EU","AND":"EU","AUT":"EU","BLR":"EU","BEL":"EU","BIH":"EU","BGR":"EU","HRV":"EU","CYP":"EU","CZE":"EU","DNK":"EU","EST":"EU","FRO":"EU","FIN":"EU","FRA":"EU","DEU":"EU","GIB":"EU","GRC":"EU","HUN":"EU","ISL":"EU","IRL":"EU","ITA":"EU","LVA":"EU","LIE":"EU","LTU":"EU","LUX":"EU","MKD":"EU","MLT":"EU","MDA":"EU","MCO":"EU","NLD":"EU","NOR":"EU","POL":"EU","PRT":"EU","ROU":"EU","SMR":"EU","SRB":"EU","SVK":"EU","SVN":"EU","ESP":"EU","SWE":"EU","CHE":"EU","UKR":"EU","GBR":"EU","VAT":"EU","RSB":"EU","IMN":"EU","XKX":"EU","MNE":"EU","AIA":"NA","ATG":"NA","ABW":"NA","BHS":"NA","BRB":"NA","BLZ":"NA","BMU":"NA","VGB":"NA","CAN":"NA","CYM":"NA","CRI":"NA","CUB":"NA","CUW":"NA","DMA":"NA","DOM":"NA","SLV":"NA","GRL":"NA","GRD":"NA","GLP":"NA","GTM":"NA","HTI":"NA","HND":"NA","JAM":"NA","MTQ":"NA","MEX":"NA","SPM":"NA","MSR":"NA","ANT":"NA","KNA":"NA","NIC":"NA","PAN":"NA","PRI":"NA","KNA":"NA","LCA":"NA","SPM":"NA","VCT":"NA","TTO":"NA","TCA":"NA","VIR":"NA","USA":"NA","SXM":"NA","BES":"NA","ARG":"SA","BOL":"SA","BRA":"SA","CHL":"SA","COL":"SA","ECU":"SA","FLK":"SA","GUF":"SA","GUF":"SA","GUY":"SA","PRY":"SA","PER":"SA","SUR":"SA","URY":"SA","VEN":"SA","ATA":"AN"};
var ContinentIndex = function(continent){
	var ans;
	switch(continent){
		case "AF": ans=0; break;
		case "AS": ans=1; break;
		case "OC": ans=2; break;
		case "EU": ans=3; break;
		case "NA": ans=4; break;
		case "SA": ans=5; break;
		case "AN": ans=6; break;
		}
	return ans;
};
							
								
var iso3166 = null;
var iso_code_to_name = function(code) {
	try {
		return iso3166.filter(function(item) {
			return item.code == code;
		})[0].name;
	} catch (e) {
		return "";
	}
};

var iso_name_to_code = function(name) {
	try {
		return iso3166.filter(function(item) {
			return item.name == name;
		})[0].code;
	} catch (e) {
		return "";
	}
};
	
var _subtypeChangeCallbacks = [];
var _subtypeChangeTriggerTimeout = null;
var _subtypeChangeTriggerFunction = function() {
	var callbacks = _subtypeChangeCallbacks;
	_subtypeChangeCallbacks = [];
	if (_subtypeChangeTriggerTimeout != null) {
		clearTimeout(_subtypeChangeTriggerTimeout);
		_subtypeChangeTriggerTimeout = null;
	}
	
	subtypeChangeCounter++;
	yellINeedToLoad();
	$(document).on("update", function thisfunc() {
		yellImDoneLoading();
		$(document).off("update", thisfunc);
		callbacks.forEach(function(item){ item(); });
	});
	setTimeout(function(){
		$(document).trigger("update");
	}, 100);
}
var scheduleSubtypeChangeEvent = function(callback) {
	if (typeof(callback) != "undefined") _subtypeChangeCallbacks.push(callback);
	pauseFunction();
	if (_subtypeChangeTriggerTimeout != null) {
		clearTimeout(_subtypeChangeTriggerTimeout);
		_subtypeChangeTriggerTimeout = null;
	}
	_subtypeChangeTriggerTimeout = setTimeout(_subtypeChangeTriggerFunction, 1000);
	$(document).trigger("slider_update");
}

var dataReady, onDataReady;
(function(){
	var _dataReadyCounter = 0;
	var _dataReadyCallbacks = [];
	dataReady = function(isReady) {
		if (!isReady) {
			_dataReadyCounter++;
		} else {
			_dataReadyCounter--;
			if (_dataReadyCounter <= 0) {
				_dataReadyCounter = 0;
				var activeCallbacks = _dataReadyCallbacks.slice(0);
				_dataReadyCallbacks = [];
				activeCallbacks.forEach(function(callback){ callback(); });
			}
		}
	};
	onDataReady = function(callback) {
		if (_dataReadyCounter <= 0) {
			callback();
		} else {
			_dataReadyCallbacks.push(callback);
		}
	};
		
	maxYearNum = function() {
		return years_by_index[selected][maxYearIndex()].yearnum;
	};
	maxYearIndex = function() {
		return years_by_index[selected].length - 1;
	};
	yearNumForYear = function(year) {
		return years_by_index[selected].where(function (item) {
			return item.year == year;
		})[0].yearnum;
	};
	yearIndexForYear = function(year) {
		return years_by_index[selected].where(function (item) {
			return item.year == year;
		})[0].yearindex;
	};
	yearForYearNum = function(yearnum) {
		return years_by_index[selected].slice(0).sort(function(a, b) {
			return (Math.abs(a.yearnum - yearnum) - Math.abs(b.yearnum - yearnum));
		})[0].year;
	};
	yearForYearIndex = function(yearindex) {
		return years_by_index[selected][yearindex];
	};
	availableIndex = function() {
		for(var i=0; i<10; i++)
			if(index_available[i])
				return i;
				
		return -1;
	};
	
	yellINeedToLoad();
	dataReady(false);
	
	for(var i=0; i<10; i++)
		index_available[i] = true;
	dataset[0] = [];
	years_by_index[0] = [];
	dataset[1] = [];
	years_by_index[1] = [];
	dataset[2] = [];
	years_by_index[2] = [];
	
	$.getJSONGz("data/military.json.gz", function(data) {
	    var filename = "Military expenditure (% of GDP)";
		selected = subtypes.length;
		index_available[selected] = false;
		
		dataset[selected] = data.sort(function(a, b){
			if(a.year != b.year) {
				return a.year - b.year;
			}
		});
				
		var firstyear = dataset[selected][0].year;
		years_by_index[selected] = [];
		points_per_year[selected] = [];

		for(var i=0; i<dataset[selected].length; i++) {
			var row = dataset[selected][i];
			row.yearnum = years_by_index[selected].length;
			var lastyear = (years_by_index[selected].length > 0 ? years_by_index[selected][maxYearIndex()] : null);
			if(lastyear == null || row.year != lastyear.year) {
				years_by_index[selected].push({year: row.year, yearnum: row.yearnum});
				points_per_year[selected].push(1);
			} else {
				points_per_year[selected][points_per_year[selected].length-1]++;
			}
			row.yearindex = maxYearIndex();
			row.scalefactors = {};
		}
		
		subtypes.push({name: "value", prettyname: filename, color: data_colors(selected), id: selected});
		currentSubtypeSet = subtypes[selected];
		for(var i=0; i<subtypes.length; i++) {
			if(i != selected) {
				$('label[for="'+ i +'"]').css("color", data_colors(i));
				$('label[for="'+ i +'"]').css("background-color", "#eee");
			}
		}
		
		dataset_Continent[selected] = [];
		for( var i=0; i<=maxYearIndex(); i++){
		   for(var j=0; j<continents.length; j++){
			   var row = dataset_Continent[selected].push({continent: continents[j], value: -1, scalefactors:-1, year: yearForYearIndex(i).year,yearindex: i, yearnum: i+1, valid:0 })
			}
		}
		
		renormalizeData(currentSubtypeSet);
		number_of_loaded_datasets++;
		//dataReady(true);
		//yellImDoneLoading();
	});	
	
	$.getJSONGz("data/gas.json.gz", function(data) {
	    var filename = "Pump price for gasoine (US$ per liter)";
		selected = subtypes.length;
		index_available[selected] = false;
		
		dataset[selected] = data.sort(function(a, b){
			if(a.year != b.year) {
				return a.year - b.year;
			}
		});
				
		var firstyear = dataset[selected][0].year;
		years_by_index[selected] = [];
		points_per_year[selected] = [];

		for(var i=0; i<dataset[selected].length; i++) {
			var row = dataset[selected][i];
			row.yearnum = years_by_index[selected].length;
			var lastyear = (years_by_index[selected].length > 0 ? years_by_index[selected][maxYearIndex()] : null);
			if(lastyear == null || row.year != lastyear.year) {
				years_by_index[selected].push({year: row.year, yearnum: row.yearnum});
				points_per_year[selected].push(1);
			} else {
				points_per_year[selected][points_per_year[selected].length-1]++;
			}
			row.yearindex = maxYearIndex();
			row.scalefactors = {};
		}
		
		subtypes.push({name: "value", prettyname: filename, color: data_colors(selected), id: selected});
		currentSubtypeSet = subtypes[selected];
		dataset_Continent[selected] = [];
		for( var i=0; i<=maxYearIndex(); i++){
		   for(var j=0; j<continents.length; j++){
			   var row = dataset_Continent[selected].push({continent: continents[j], value: -1, scalefactors:-1, year: yearForYearIndex(i).year,yearindex: i, yearnum: i+1, valid:0 })
			}
		}
		
		renormalizeData(currentSubtypeSet);
		number_of_loaded_datasets++;
		//dataReady(true);
		//yellImDoneLoading();
	});
	
	$.getJSONGz("data/rd.json.gz", function(data) {
	    var filename = "Research and developement expenditure (% of GDP)";
		selected = subtypes.length;
		index_available[selected] = false;
		
		dataset[selected] = data.sort(function(a, b){
			if(a.year != b.year) {
				return a.year - b.year;
			}
		});
				
		var firstyear = dataset[selected][0].year;
		years_by_index[selected] = [];
		points_per_year[selected] = [];

		for(var i=0; i<dataset[selected].length; i++) {
			var row = dataset[selected][i];
			row.yearnum = years_by_index[selected].length;
			var lastyear = (years_by_index[selected].length > 0 ? years_by_index[selected][maxYearIndex()] : null);
			if(lastyear == null || row.year != lastyear.year) {
				years_by_index[selected].push({year: row.year, yearnum: row.yearnum});
				points_per_year[selected].push(1);
			} else {
				points_per_year[selected][points_per_year[selected].length-1]++;
			}
			row.yearindex = maxYearIndex();
			row.scalefactors = {};
		}
		
		subtypes.push({name: "value", prettyname: filename, color: data_colors(selected), id: selected});
		currentSubtypeSet = subtypes[selected];
		dataset_Continent[selected] = [];
		for( var i=0; i<=maxYearIndex(); i++){
		   for(var j=0; j<continents.length; j++){
			   var row = dataset_Continent[selected].push({continent: continents[j], value: -1, scalefactors:-1, year: yearForYearIndex(i).year,yearindex: i, yearnum: i+1, valid:0 })
			}
		}
		
		renormalizeData(subtypes[2]);
		number_of_loaded_datasets++;
		dataReady(true);
		yellImDoneLoading();
	});
	
	yellINeedToLoad();
	dataReady(false);
	$.getJSONGz("data/iso3166.json.gz", function(data) {
		iso3166 = data;
		dataReady(true);
		yellImDoneLoading();
	});
	
	yellINeedToLoad();
	dataReady(false);
	//load population data
	dataReady(true);
	yellImDoneLoading();
		
	yellINeedToLoad();
	dataReady(false);
	//load area data
	dataReady(true);
	yellImDoneLoading();
	
	yellINeedToLoad();
	dataReady(false);
	//load participation data
	dataReady(true);
	yellImDoneLoading();
})();

var renormalizeData = function(subtypeSet) {
	console.log("renormalize data");
	console.log(JSON.stringify(subtypeSet));

	var yearMins = new Array(maxYearIndex()+1);
	var yearMaxes = new Array(maxYearIndex()+1);
	
	for(var i=0; i<=maxYearIndex(); i++) {
		yearMins[i] = Number.MAX_VALUE;
		yearMaxes[i] = -1*Number.MAX_VALUE;
	}
	
	for(var i=0; i<dataset[selected].length; i++) {
		if(dataset[selected][i].value < yearMins[dataset[selected][i].yearindex])
			yearMins[dataset[selected][i].yearindex] = dataset[selected][i].value;
		if(dataset[selected][i].value > yearMaxes[dataset[selected][i].yearindex])
			yearMaxes[dataset[selected][i].yearindex] = dataset[selected][i].value;	
	}
	
	/*for(var i=0; i<=maxYearIndex(); i++) {
		console.log("Min " + i + " = " + yearMins[i]);
		console.log("Max " + i + " = " + yearMaxes[i]);
	}*/
	
	
	
	var avg_per_continent_per_year = [];
	var numberofcountries= [54,47,23,43,12,14,1];
    
    //keep track of the years that at least one country in each continent
    //has any data
    var valid_years = new Array(maxYearIndex()+1)
	for(i = 0; i <=maxYearIndex(); i++) {
		var arr2 = [];
		for(j = 0; j < continents.length; j++) {
				arr2.push(0);
		}
			avg_per_continent_per_year.push(arr2);
            valid_years[i] = new Array(continents.length);
	}

	
	var yearMaximum = yearMaxes.max(maxYearIndex()+1);
    
    
    
	var val = dataset[selected].forEach(function(row) {
		row.scalefactors[subtypeSet.name] = 1.0/yearMaximum;
		avg_per_continent_per_year[row.yearindex][ContinentIndex(list_Continent[row.country])] +=  row.value;
        //console.log(ContinentIndex(list_Continent[row.country]));
        valid_years[row.yearindex][ContinentIndex(list_Continent[row.country])] = 1;

	});	
	
	//Continent staff
		//Maximum over all averages over all the years
		var yearMaximumContinent = -1*Number.MAX_VALUE ;
		for(i = 0; i <= maxYearIndex(); i++) 
		{
			
			for(j = 0; j < continents.length; j++) 
			{
				avg_per_continent_per_year[i][j] /= numberofcountries[j];
		
				if(avg_per_continent_per_year[i][j]>yearMaximumContinent)
				{
					yearMaximumContinent = avg_per_continent_per_year[i][j];
				}
			}
		}
		

	var val = dataset_Continent[selected].forEach(function(row) {
        //push data only if the pair (year ,continent) is valid
        //ie only if there exists at least one country in the continent
        //that has some data for this year
        if(valid_years[row.yearindex][ContinentIndex(row.continent)]==1)
        {
            row.value = avg_per_continent_per_year[row.yearindex][ContinentIndex(row.continent)];
            row.scalefactors = 1.0/yearMaximumContinent;
            row.valid = 1;
        }
	
	});	



};
