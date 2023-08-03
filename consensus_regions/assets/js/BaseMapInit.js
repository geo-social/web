var map;
var onlineLayer;
var referenceLayer;
var otherTerrainLayer;
var scaleControl;
var zoomControl;

var CSVData, cbData, pointData;
//// The CSV values for the Choropleth map.
//var commutesValues = [], migrantsValues = [], fbValues = [], twValues = [], tripsValues = [], cwValues = [], cnwValues = [];
//// The hash map from id to the CSV value of Choropleth map.
//var commutesMap, migrantsMap, fbMap, twMap, tripsMap, cwMap, cnwMap;

var IdValueMap, IdColorMap, smryMap;
var CSVValues = [];
var inputData = [];
var colorData = [];
var valueFieldName;
var progressValue = 0;

//var path = d3.geoPath().projection(projection);
var svg_user_painting = d3.selectAll("#UserOverlay").append("svg").attr("id", "svg_user_painting")
.style("display", "block")
.attr("width", window.innerWidth)
.attr("height", window.innerHeight);

// Graph of d3 for choropleth map
var g1 = svg_user_painting.append("g");
var g2 = svg_user_painting.append("g");
var g3 = svg_user_painting.append("g");

var CPMbound = [[20037508.34, 20037508.34], [-20037508.34, -20037508.34]];

// Define current projection;
var baseMap = {
		projection: null,
		overlay: null,
		view: null
};

const ctgcColors = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf",
	"#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666",
	"#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928",
	"#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999",
	"#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

function init() {
    var extent = [-20037508.34, -20037508.34,
        20037508.34, 20037508.34];

//    var mousePositionControl = new ol.control.MousePosition({
//    	  coordinateFormat: ol.coordinate.createStringXY(4),
//    	  projection: 'EPSG:900913',
//    	  // comment the following two lines to have the mouse position
//    	  // be placed within the map.
//    	  className: 'custom-mouse-position',
//    	  target: document.getElementById('mouse-position'),
//    	  undefinedHTML: '&nbsp;'
//    	});

    map = new ol.Map({
        controls: ol.control.defaults({
            zoom : true,
            attribution: false
        })
        .extend([setScaleControl(), setZoomControl([-2353892.1951788496, 1865771.6377280578, 2258113.546080044, -1334451.3008315626])])
        ,
        target: "map"
    });

//    var point = new ol.geom.Point([-96, 37]).transform("EPSG:4326", "EPSG:900913");
    onlineLayer = new ol.layer.Tile();
    switchBaseMapLayer(5);
    otherTerrainLayer = new ol.layer.Tile();
    referenceLayer = new ol.layer.Tile();
    onlineLayer.setZIndex(1);
    otherTerrainLayer.setZIndex(0);
    referenceLayer.setZIndex(2);
    map.addLayer(onlineLayer);
    baseMap.overlay = new ol.Overlay({id: "UserOverlay", element: document.getElementById('UserOverlay'), stopEvent: false, insertFirst: false, autoPan: false});
    map.addOverlay(baseMap.overlay);

    baseMap.projection = registerProjection("ESRI:102003", "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=37.5 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m+no_defs");

    baseMap.view = new ol.View({
    	center:ol.proj.transform([-96, 38], "EPSG:4326", baseMap.projection),
    	zoom: 5.3,
        projection: baseMap.projection,
        extent: extent
    });
    map.setView(baseMap.view);
}

function setScaleControl() {
		  scaleControl = new ol.control.ScaleLine({
	      units: "metric"
	    });
	    return scaleControl;
}

function setZoomControl(zoomExtent){
	zoomControl = new ol.control.ZoomToExtent({
		extent: zoomExtent
    });
	return zoomControl;
}

function switchBaseMapLayer(defaultLayer){
	var baseMapVal = document.getElementById("Online_BaseMap-Select") ? parseInt(document.getElementById("Online_BaseMap-Select").value) : defaultLayer;
	  map.removeLayer(otherTerrainLayer);
	  map.removeLayer(referenceLayer);
	  switch(baseMapVal){
  	  case 1:{
  		  onlineLayer.setSource(new ol.source.Stamen({
		        layer: 'toner-lite',
		        crossOrigin: "Anonymous"
  		  }));
  		  break;
  	  };
  	  case 2:{
  		  onlineLayer.setSource(new ol.source.OSM({
  			  crossOrigin: "Anonymous"
  		  }));
  		  break;
  	  };
  	  case 3:{
  		  onlineLayer.setSource(new ol.source.XYZ({
      	        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
      	            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      	        url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  break;
  	  };
  	  case 4:{
  		  onlineLayer.setSource(new ol.source.XYZ({
      	        attributions: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
      	        url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  break;
  	  };
  	  case 5:{
  		//light gray canvas
  		  onlineLayer.setSource(new ol.source.XYZ({
      	        attributions:  'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      	        url:'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  break;
  	  };
  	  case 6:{
  		//dark gray canvas
  		  onlineLayer.setSource(new ol.source.XYZ({
      	        attributions: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
      	        url:'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  map.addLayer(referenceLayer);
  		  referenceLayer.setSource(new ol.source.XYZ({
      	        attributions:  'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      	        url:'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  break;
  	  };
  	  case 7:{
  		  // Terrain with labels
  		  onlineLayer.setSource(new ol.source.XYZ({
      	        attributions: 'Esri, HERE, Garmin, FAO, NOAA, USGS, Intermap, METI, © OpenStreetMap contributors, and the GIS User Community',
      	        url:'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  otherTerrainLayer.setSource(new ol.source.XYZ({
      	        attributions: 'Esri, HERE, Garmin, FAO, NOAA, USGS, Intermap, METI, © OpenStreetMap contributors, and the GIS User Community',
      	        url:'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		   referenceLayer.setSource(new ol.source.XYZ({
      	        attributions: 'Esri, HERE, Garmin, FAO, NOAA, USGS, Intermap, METI, © OpenStreetMap contributors, and the GIS User Community',
      	        url:'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		   map.addLayer(otherTerrainLayer);
  		   map.addLayer(referenceLayer);
  		  break;
  	  };
  	  case 8:{
  		  // Topographic
  		  onlineLayer.setSource(new ol.source.XYZ({
      	        attributions: ' Esri, DeLorme, NAVTEQ, TomTom, Intermap, increment P Corp, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, and the GIS User Community',
      	        url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
	  		        crossOrigin: "Anonymous"
      	      }));
  		  break;
  	  };
  	  default:
  		  break;
	  };
}

progressValue = 0;
loadProgressBar(progressValue);

magnificPopupWindow("LoadingProgress-Block", "");
init();

progressValue += 20;
loadProgressBar(progressValue);

function loadProgressBar(value){
	$("#Loading-Progress").val(value);
	$("#Progress-Label").text(value + "%");
	if(value >= 100){
		magnificCloseWindow("LoadingProgress-Block");
	}
}

function magnificPopupWindow(id, type){
	if ($('#' + id).length) {
		const a = document.createElement("a");
		  a.setAttribute("id", "PopupTrigger-A");
		  document.body.appendChild(a);
		  a.click();

		 $('#PopupTrigger-A').magnificPopup({
	        items: {
	            src: '#' + id
	        },
//	        mainClass: type, // this class is for CSS animation below
	        callbacks: {
	            beforeOpen: function() {
	               this.st.mainClass = type;
	            }
	        },
	        removalDelay: 500,
	        showCloseBtn:false,
	        closeBtnInside: false,
	        closeOnBgClick: false
	    }).click();
		document.body.removeChild(a);
	}
}

function magnificCloseWindow(id){
	if ($('#' + id).length) {
		$('#' + id).magnificPopup('close');
	}
}


function makeColName(){
	var cmts = $("#Commuters-Input").val();
	var trips = $("#Trips-Input").val();
	var mgs = $("#Migrants-Input").val();
	var sts = $("#States-Input").val();
	valueFieldName = "x" + cmts + mgs + trips + sts;
	return valueFieldName;
}

d3.csv("./data/consensusregion_v0.csv", function(data) {
	makeHashMap(data, "fips");
	progressValue += 10;
	loadProgressBar(progressValue);

	d3.csv("./data/consensusregion.csv", function(data) {
		makeColorMap(data, "fips");
		progressValue += 10;
		loadProgressBar(progressValue);
		d3.json("./data/contiguous_counties_2019_topo_simplified40.json", function(data) {
			cbData = data;
		    drawCounties(data);
		    progressValue += 20;
			loadProgressBar(progressValue);
		});
	});

	d3.json("./data/states_latlon.json", function(data) {
	    drawStateBoundary(data);
	    progressValue += 10;
		loadProgressBar(progressValue);
	});

	d3.json("./data/Cities4.json", function(data) {
		pointData = data;
	    drawPoints(data);
	    progressValue += 10;
		loadProgressBar(progressValue);
	});
});

d3.csv("./data/summary_web.csv", function(data) {
	makeHashMapForSummary(data)
	$('#NumOfRegions-Span').text(smryMap.get('x0000')['nregion']);
	if(isFloat(+smryMap.get('x0000')['modularity'])){
		$('#Modularity-Span').text((+smryMap.get('x0000')['modularity']).toFixed(2));
	}
	else
		$('#Modularity-Span').text(smryMap.get('x0000')['modularity']);
	progressValue += 20;
	loadProgressBar(progressValue);
});

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function registerProjection(name, proj4Str){
	 proj4.defs(name, proj4Str);
	 ol.proj.proj4.register(proj4);
	 return name;
}
