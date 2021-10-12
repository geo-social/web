var colorScheme = d3.scaleOrdinal()
	.range(ctgcColors);
function drawStateBoundary(world){
    g2.selectAll("path").remove();
    CPMbound = d3.geoBounds(world);
    var feature = g2.selectAll("path")
	//The way that we load features into the map
		.data(world.features)
		.enter()
        .append("path")
        //attr should be placed on the bottom of what you want to add otherwise it won't be added
        .attr("d", pathOnOBM)
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("fill", "none")
//        .on("mouseover", function(){
//			d3.select(this).attr("stroke-width", strokeWidth + 3)
//			.attr("stroke", "cyan");
//		})
//		.on("mouseout", function(){
//			d3.select(this).attr("stroke-width", strokeWidth)
//			.attr("stroke", "black");;
//		});

    var coor = map.getCoordinateFromPixel([0,0]);
    baseMap.overlay.setPosition(coor);
}

function drawCounties(counties){
//	var CSVValues, IdValueMap;
//	switch($('#CSVField-Select').val()){
//	    case "commutes":{
//	    	CSVValues = commutesValues;
//	    	IdValueMap = commutesMap;
//	    	break;
//	    };
//	    case "migrants":{
//	    	CSVValues = migrantsValues;
//	    	IdValueMap = migrantsMap;
//	    	break;
//	    };
//	    case "facebook":{
//	    	CSVValues = fbValues;
//	    	IdValueMap = fbMap;
//	    	break;
//	    };
//	    case "twitter":{
//	    	CSVValues = twValues;
//	    	IdValueMap = twMap;
//	    	break;
//	    };
//	    case "trips":{
//	    	CSVValues = tripsValues;
//	    	IdValueMap = tripsMap;
//	    	break;
//	    };
//	    case "cw":{
//	    	CSVValues = cwValues;
//	    	IdValueMap = cwMap;
//	    	break;
//	    };
//	    case "cnw":{
//	    	CSVValues = cnwValues;
//	    	IdValueMap = cnwMap;
//	    	break;
//	    };
//	    default:{
//	    	console.log('err');
//	    	break;
//	    }
//	}
	
    g1.selectAll("path").remove();
    CPMbound = d3.geoBounds(counties);
    var textBox = d3.select("#AttributeBox-Block");
    var strokeWidth = 0.2;
    var valueField = makeColName();
    var feature = g1.selectAll("path")
	//The way that we load features into the map
		.data(topojson.feature(counties, counties.objects.contiguous_counties_2019).features)
		.enter()
        .append("path")
        //attr should be placed on the bottom of what you want to add otherwise it won't be added
        .attr("d", pathOnOBM)
        .attr("stroke", "white")
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", "round")
        .attr("fill", function(d){
        	// This is the old version code for consensusregion_v0
//        	if(IdValueMap.get(+d.properties["FIPS"]) && valueField in IdValueMap.get(+d.properties["FIPS"])){
//        		return colorScheme(+IdValueMap.get(+d.properties["FIPS"])[valueField]);
//        	}
//    		else{
//    			hasNull = true;
//    			return "grey";
//    		}
        	
        	// This is the new code for consensusregion
        	if(IdColorMap.get(+d.properties["FIPS"]) && valueField in IdColorMap.get(+d.properties["FIPS"])){
        		return IdColorMap.get(+d.properties["FIPS"])[valueField];
        	}
    		else{
    			hasNull = true;
    			return "grey";
    		}
        })
        .on("mouseover", function(d){
        	let valueField = makeColName();
        	d3.select(this).attr("stroke-width", strokeWidth + 3)
    		.attr("stroke", "cyan");
    		
    		textBox.transition()
            .duration(200)
            .style("opacity", 1);
    		
    		//textBox.html(`GEOID: ` + +d.properties["FIPS"] + "</br>" + `Value: ` + IdValueMap.get(+d.properties["FIPS"])[valueField])
    		textBox.html(d.properties["NAME"] + ` County, ` + d.properties["STATE_NAME"] + "</br>" + `Region ID: ` + IdValueMap.get(+d.properties["FIPS"])[valueField])
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
		})
		.on("mouseout", function(){
			d3.select(this).attr("stroke-width", strokeWidth)
			.attr("stroke", "none");
			
			textBox.transition()
	        .duration(200)
	        .style("opacity", 0);
		});
}

function drawPoints(points){
    g3.selectAll("path").remove();
    var features = g3.selectAll("circle")
	//The way that we load features into the map
		.data(points.features)
		.enter()
		
	features.append("text")
        .attr("dx", function(d){
        	return projectToOnlineBaseMap(d.geometry.coordinates)[0] + 5;
        })
        .attr("dy", function(d){
        	if(d.properties['NAME'] == 'Topeka'){
        		return projectToOnlineBaseMap(d.geometry.coordinates)[1] + 10;
        	}
        	else
        		return projectToOnlineBaseMap(d.geometry.coordinates)[1];
        })
        .style("font-size", "0.7em")
//        .style("text-anchor", "middle")
        .text(function(d){return d.properties['NAME'];});
	features.append("circle")
        //attr should be placed on the bottom of what you want to add otherwise it won't be added
        .attr("cx", function(d){
        	return projectToOnlineBaseMap(d.geometry.coordinates)[0];
        })
        .attr("cy", function(d){
        	return projectToOnlineBaseMap(d.geometry.coordinates)[1];
        })
        .attr("r", 3)
        .attr("fill", "black");
}


function refillCounties(world){
    var valueField = makeColName();
	var feature = g1.selectAll("path")
		.attr("fill", function(d){
			// This is for consensusregion
//			if(IdValueMap.get(+d.properties["FIPS"]) && valueField in IdValueMap.get(+d.properties["FIPS"])){
//        		return colorScheme(+IdValueMap.get(+d.properties["FIPS"])[valueField]);
//        	}
//    		else{
//    			hasNull = true;
//    			return "grey";
//    		}
			
			// This is for consensusregion_v0
			if(IdColorMap.get(+d.properties["FIPS"]) && valueField in IdColorMap.get(+d.properties["FIPS"])){
        		return IdColorMap.get(+d.properties["FIPS"])[valueField];
        	}
    		else{
    			hasNull = true;
    			return "grey";
    		}
        })
}