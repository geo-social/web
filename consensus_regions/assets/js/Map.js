function projectToOnlineBaseMap(x) {
	if(!x) return;
    var point = map.getPixelFromCoordinate(new ol.proj.transform([x[0], x[1]], "EPSG:4326", baseMap.projection));
    return [point[0], point[1]];
}

function projectToOnlineBaseMapTransform(map) {
	  return d3.geoTransform({
	    point: function(x, y) {
	    	var point = map.getPixelFromCoordinate(new ol.proj.transform([x, y], "EPSG:4326", baseMap.projection));
	    	this.stream.point(point[0] , point[1]);
	    }
	  });
}

// Add or remove options for selection boxes.
function addOption(selectElement, optionName, value) {
	var x = document.getElementById(selectElement);
	var option = document.createElement("option");
	  option.text = optionName;
	  option.value = value;
	  x.add(option);
}

function removeOptions(selectElement) {
	var x = document.getElementById(selectElement);
	var i, L = x.options.length - 1;
	if(L == 0) return null;
	else
		for(i = L; i >= 0; i--) {
			x.remove(i);
		}
}

//Define the path projection to the online base map! 
//Write like this because in d3.4 we must use project stream to create self-designed projection.
var pathOnOBM = d3.geoPath().projection(projectToOnlineBaseMapTransform(map));

function deleteExistingLayer(layerName){
	for(var i = 0; i < map.layers.length; i++)
		if(map.layers[i].name == layerName){
			map.removeLayer(map.layers[i]);
			break;
		}
}

function resetSummary(){
	var valueField = makeColName();
	$('#NumOfRegions-Span').text(smryMap.get(valueField)['nregion']);
	if(isFloat(+smryMap.get(valueField)['modularity']))
		$('#Modularity-Span').text((+smryMap.get(valueField)['modularity']).toFixed(2));
	else
		$('#Modularity-Span').text(smryMap.get(valueField)['modularity']);
}

function getBoundOfOverlay(){
	var topleft = [Math.min(Math.min(CPMbound[0][0], flowbound[0][0]), pointbound[0][0]), Math.min(Math.min(CPMbound[0][1], flowbound[0][1]), pointbound[0][1])];
	var bottomright = [Math.max(Math.max(CPMbound[1][0], flowbound[1][0]), pointbound[1][0]), Math.max(Math.max(CPMbound[1][1], flowbound[1][1]), pointbound[1][1])];
	return [topleft, bottomright];
}

function setZoomToOverlay(margin){
	var overlayBoundary = getBoundOfOverlay();
	var leftBot = new ol.proj.transform([overlayBoundary[0][0], overlayBoundary[0][1]], "EPSG:4326", "EPSG:900913");
	var rightUp = new ol.proj.transform([overlayBoundary[1][0], overlayBoundary[1][1]], "EPSG:4326", "EPSG:900913");
	var extent = [leftBot[0] - margin, leftBot[1] - margin,rightUp[0] + margin, rightUp[1] + margin];
	map.removeControl(zoomControl);
	map.addControl(setZoomControl(extent));
}


// Make sure the d3 overlay move when the map is panned.
function resetMapOverlay(e){
	$('#svg_user_painting').css('display','block');
	var coor = map.getCoordinateFromPixel([0,0]);
	baseMap.overlay.setPosition(coor);
    g1.selectAll("path").attr("d", pathOnOBM);
    g2.selectAll("path").attr("d", pathOnOBM);
    g3.selectAll("circle").attr("cx", d => projectToOnlineBaseMap(d.geometry.coordinates)[0]).attr("cy", d => projectToOnlineBaseMap(d.geometry.coordinates)[1]);
    g3.selectAll("text").attr("dx", function(d){
    	return projectToOnlineBaseMap(d.geometry.coordinates)[0] + 5;
    })
    .attr("dy", function(d){
    	if(d.properties['NAME'] == 'Topeka'){
    		return projectToOnlineBaseMap(d.geometry.coordinates)[1] + 10;
    	}
    	else
    		return projectToOnlineBaseMap(d.geometry.coordinates)[1];
    })
    
}
//var preZoom = baseMap.view.getZoom();
function resetMapOverlayPostRender(e){
	var dis = $('#svg_user_painting').css('display');
	if(dis)
		$('#svg_user_painting').css('display','none');
}

//this.map.getView().on('change:resolution', resetMapOverlay);
//this.map.getView().on('change:zoom', resetMapOverlay);
map.on("moveend",resetMapOverlay);
this.map.getView().on("change:resolution",resetMapOverlayPostRender);

function alertFieldInputError(fieldName){
	  alert("Error: please make sure you have chosen the correct " + fieldName + "!");
}

function alertMaxNumOfFlowError(flowNum){
	  alert("Error: You data only contains " + flowNum + " flows. You can only show "+ flowNum + " flows in maximum.");
}

function alertCSVLoadingError(){
	  alert("CSV loading failed.");
}

function alertManualBreakInputError(){
	alert("Manual break setting can not be empty");
}

function checkFieldInput(checkedData, fieldName, fieldValue){
	  if(checkedData.length <= 0){
		  alert("You data have no record. Please check your data.");
		  return false;
	  }
	  
	  if(!Object.keys(checkedData[0]).includes(fieldValue)) {
	  alertFieldInputError(fieldName);
  	  return false;
    }
	  return true;
}

function checkChangeMap(){
	if($("#Flow_DisplayAsAbs-CB").is(":checked")){
		  if(document.getElementById("Flow_ColorScheme-Select").value != "black" && document.getElementById("Flow_Classification-Select").value != "Proportional"){
  			alert('Change flow map does not support classified method currently. Please try proportional classification method.');
  			$("#Flow_DisplayAsAbs-CB").prop('checked', false);
  			return false;
  		}
	}
	return true;
}

function exportMap(format){
	map.once('rendercomplete', function () {
	    var mapCanvas = document.createElement('canvas');
	    var size = map.getSize();
	    mapCanvas.width = size[0];
	    mapCanvas.height = size[1];
	    var mapContext = mapCanvas.getContext('2d');
	    Array.prototype.forEach.call(
	      document.querySelectorAll('.ol-layer canvas'),
	      function (canvas) {
	        if (canvas.width > 0) {
	          var opacity = canvas.parentNode.style.opacity;
	          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
	          var transform = canvas.style.transform;
	          // Get the transform parameters from the style's transform matrix
	          var matrix = transform
	            .match(/^matrix\(([^\(]*)\)$/)[1]
	            .split(',')
	            .map(Number);
	          // Apply the transform to the export map context
	          CanvasRenderingContext2D.prototype.setTransform.apply(
	            mapContext,
	            matrix
	          );
	          mapContext.drawImage(canvas, 0, 0);
	        }
	      }
	    );
	    
	    var svgs = document.querySelectorAll('svg');
	    var translate = null, width = 0, height = 0, legendHeight = mapCanvas.height;
	 // get svg data
	    for(var i = 0; i < svgs.length; i++, width = 0, height = 0, translate = null){
	    	var svg = svgs[i];
	    	if(translate != null){
	    		var matrix = translate
	            .match(/^translate\(([^\(]*)\)$/)[1]
	            .split(',')
	            .map(Number);
	    		width = -matrix[0];
	    		height = -matrix[1]
	    	}
	    	var xml = new XMLSerializer().serializeToString(svg);

 		    // make it base64
 		    var svg64 = btoa(xml);
 		    var b64Start = 'data:image/svg+xml;base64,';

 		    // prepend a "header"
 		    var image64 = b64Start + svg64;

 		    // set it as the source of the img element
 		    drawImage(image64, width, height);
	    }
	    var onloadCount = 0;
	    function drawImage(URL, width, height) {
	      var img = new Image();
	      img.moveX = width;
	      img.moveY = height;
	      img.crossOrigin = 'Anonymous';
	      img.onload = function() {
	    	  mapContext.drawImage(img, this.moveX, this.moveY);
	    	  onloadCount++;
	    	  if(onloadCount == svgs.length){
	    		  if (navigator.msSaveBlob) {
	    		      // link download attribute does not work on MS browsers
	    		      navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
	    		    } else {
	    		      var link = document.getElementById('MapDownload-A');
	    		      link.href = mapCanvas.toDataURL("image/jpeg");
	    		      link.download = makeColName() + format;
	    		      link.click()
	    		    }
	    	  }
	      };
	      img.src = URL;
	    }
	  });
	  map.renderSync();
}