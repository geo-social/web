function parseCSVDataOfChoroplethMap(data){
	var CSVData = d3.csvParse(data);
	var keyNames = Object.keys(CSVData[0]);
	
	removeOptions("CPM_CSVPK-Select");
	removeOptions("CPM_Value-Select");
	for(var i = 0; i < keyNames.length; i++){
		addOption("CPM_CSVPK-Select", keyNames[i], keyNames[i]);
		addOption("CPM_Value-Select", keyNames[i], keyNames[i]);
	}
	
	return CSVData;
}

//function makeHashMap(data, dataId, value, type){
//	var commutesData = [], migrantsData = [], fbData = [], twData = [], tripsData = [], cwData = [], cnwData = [];
//	data.forEach(function (obj){
//	    var pair = [+obj[dataId], +obj[value]];
//	    var slData, slValue;
//	    switch(obj[type]){
//		    case "Commutes":{
//		    	slData = commutesData;
//		    	slValue = commutesValues;
//		    	break;
//		    };
//		    case "Migrants":{
//		    	slData = migrantsData;
//		    	slValue = migrantsValues;
//		    	break;
//		    };
//		    case "Facebook":{
//		    	slData = fbData;
//		    	slValue = fbValues;
//		    	break;
//		    };
//		    case "Twitter":{
//		    	slData = twData;
//		    	slValue = twValues;
//		    	break;
//		    };
//		    case "Trips":{
//		    	slData = tripsData;
//		    	slValue = tripsValues;
//		    	break;
//		    };
//		    case "consensus_weights":{
//		    	slData = cwData;
//		    	slValue = cwValues;
//		    	break;
//		    };
//		    case "consensus_noweights":{
//		    	slData = cnwData;
//		    	slValue = cnwValues;
//		    	break;
//		    };
//		    default:{
//		    	console.log('err');
//		    	break;
//		    }
//	    }
//	    
//	    slData.push(pair);
//	    if(!obj[value])
//	    	slValue.push(null);
//	    else
//	    	slValue.push(+obj[value]);
//	  	});
//	
//		commutesMap = Object.assign(new Map(commutesData));
//		migrantsMap = Object.assign(new Map(migrantsData));
//		fbMap = Object.assign(new Map(fbData));
//		twMap = Object.assign(new Map(twData));
//		tripsMap = Object.assign(new Map(tripsData));
//		cwMap = Object.assign(new Map(cwData));
//		cnwMap = Object.assign(new Map(cnwData));
//}

function makeHashMap(data, dataId){
	data.forEach(function (obj){
	    var pair = [+obj[dataId], obj];
	    inputData.push(pair);
  	});
	
	IdValueMap = Object.assign(new Map(inputData));
}


function makeHashMapForSummary(data){
	var summaryInput = [];
	data.forEach(function (obj){
	    var pair = [obj['weight'], obj];
	    summaryInput.push(pair);
  	});
	
	smryMap = Object.assign(new Map(summaryInput));
}

function makeColorMap(data, dataId){
	data.forEach(function (obj){
	    var pair = [+obj[dataId], obj];
	    colorData.push(pair);
  	});
	
	IdColorMap = Object.assign(new Map(colorData));
}