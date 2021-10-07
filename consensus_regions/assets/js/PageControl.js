$(document).ready(function(){
	// Inline popups
    $('.inline-popups').magnificPopup({
      delegate: 'a',
      removalDelay: 500, //delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: function() {
           this.st.mainClass = this.st.el.attr('data-effect');
        }
      },
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
	
	$('#Weights-Menu').draggable();
	
	$('.Slider').on('click', function (e) {
		refillCounties(cbData);
		resetSummary();
	});
	
	$('#ExportJPG-Btn').on('click', function (e) {
		 exportMap(".jpg")
	});
	
	$('#ExportTIF-Btn').on('click', function (e) {
		 exportMap(".tiff");
	});
	
	$('#Transparency-Input').on('change', function (e) {
		var transparency = +$('#Transparency-Input').val();
		 g1.selectAll("path").style("opacity", (100 - transparency) * 0.01);
	});
	
	$('#DownloadData-A').on('click', function (e) {
		 var processRow = function (row) {
		        var finalVal = '';
		        for (var j = 0; j < row.length; j++) {
		            var innerValue = row[j] === null ? '' : row[j].toString();
		            if (row[j] instanceof Date) {
		                innerValue = row[j].toLocaleString();
		            };
		            var result = innerValue.replace(/"/g, '""');
		            if (result.search(/("|,|\n)/g) >= 0)
		                result = '"' + result + '"';
		            if (j > 0)
		                finalVal += ',';
		            finalVal += result;
		        }
		        return finalVal + '\n';
		    };

		    // Hard copy the input data.
		    var rows = [];
		    rows.push(['fips', valueFieldName]);
		    for(var i = 0; i < inputData.length; i++){
		    	var pair = [inputData[i][0], +inputData[i][1][valueFieldName]];
		    	rows.push(pair);
		    }
		    var csvFile = '';
		    for (var i = 0; i < rows.length; i++) {
		        csvFile += processRow(rows[i]);
		    }

		    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
		    if (navigator.msSaveBlob) { // IE 10+
		        navigator.msSaveBlob(blob, "data.csv");
		    } else {
		        var link = document.getElementById('MapDownload-A');
		        if (link.download !== undefined) { 
		        	// feature detection
		            // Browsers that support HTML5 download attribute
		            var url = URL.createObjectURL(blob);
		            link.setAttribute("href", url);
		            link.setAttribute("download", makeColName() + ".csv");
		            link.style.visibility = 'hidden';
		            link.click();
		        }
		    }
	});
});
