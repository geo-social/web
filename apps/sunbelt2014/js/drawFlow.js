function drawFlow(x1, y1, x2, y2, flowSize, sourceSize, targetSize, flowType) {

	if (flowType == "curved")
		return drawOneWayBendedFlowWithArrow(x1, y1, x2, y2, flowSize,
				sourceSize, targetSize);
	else
		return drawOneWayStraightFlowWithArrow(x1, y1, x2, y2, flowSize,
				sourceSize, targetSize);
}

function drawOneWayStraightFlowWithArrow(x1, y1, x2, y2, flowSize, sourceSize,
		targetSize) {
	var ndsize0 = Math.sqrt(sourceSize) / 3;
	var ndsize3 = Math.sqrt(targetSize) / 3;
	var width = Math.sqrt(flowSize);
	var dx = Math.abs(x2 - x1);
	var dy = Math.abs(y2 - y1);
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist < (ndsize0 + ndsize3) * 1.6)
		return;

	var haselbow = true;
	var arrowlen = 3.0;
	if (dist < (ndsize0 + ndsize3) * 2.5)
		arrowlen = 1.0;

	// Shorten the length so that the line only touches the node circle
	if (haselbow) {
		x1 = x1 + (x2 - x1) * ndsize0 / dist;
		y1 = y1 + (y2 - y1) * ndsize0 / dist;
		x2 = x2 - (x2 - x1) * ndsize3 / (dist - ndsize0);
		y2 = y2 - (y2 - y1) * ndsize3 / (dist - ndsize0);
	}
	// Four corners of a flow line
	var xc1 = null, yc1 = null, xc2 = null, yc2 = null;
	// Four points to round the head
	var x2elbow1 = null, y2elbow1 = null;
	var sign = 1;
	var xdelta = null, ydelta = null, xarrowdelta = null, yarrowdelta = null, xgap = null, ygap = null;
	var gap = width * 0.05;
	if (y1 == y2) { // horizontal
		xdelta = 0;
		ydelta = width / 2;
		xarrowdelta = 0;
		yarrowdelta = width / 1.0;
		xgap = 0;
		ygap = gap;
	} else if (x1 == x2) { // vertical
		ydelta = 0;
		xdelta = width / 2;
		yarrowdelta = 0;
		xarrowdelta = width / 1.0;
		xgap = gap;
		ygap = 0;
	} else {
		var v = (x2 - x1) / (y1 - y2);
		xdelta = width / 2.0 / Math.sqrt(1 + v * v);
		ydelta = Math.abs(xdelta * v);
		xarrowdelta = width / Math.sqrt(1 + v * v);
		yarrowdelta = Math.abs(xarrowdelta * v);
		xgap = gap / Math.sqrt(1 + v * v);
		ygap = Math.abs(xgap * v);
		if (v > 0)
			sign = -1;
	}

	x1 = (y1 > y2) ? x1 + xgap : x1 - xgap;
	x2 = (y1 > y2) ? x2 + xgap : x2 - xgap;
	y1 = (x1 > x2) ? y1 - ygap : y1 + ygap;
	y2 = (x1 > x2) ? y2 - ygap : y2 + ygap;

	xc1 = (y1 > y2) ? x1 + xdelta : x1 - xdelta;
	yc1 = (x1 > x2) ? y1 - ydelta : y1 + ydelta;
	xc2 = (y1 > y2) ? x2 + xdelta + arrowlen * ydelta * sign : x2 - xdelta
			- arrowlen * ydelta * sign;
	yc2 = (x1 > x2) ? y2 - ydelta + arrowlen * xdelta * sign : y2 + ydelta
			- arrowlen * xdelta * sign;

	x2elbow1 = (y1 > y2) ? x2 + xarrowdelta + arrowlen * ydelta * sign : x2
			- xarrowdelta - arrowlen * ydelta * sign;
	y2elbow1 = (x1 > x2) ? y2 - yarrowdelta + arrowlen * xdelta * sign : y2
			+ yarrowdelta - arrowlen * xdelta * sign;

	return "M" + x1 + "," + y1 + "L" + xc1 + "," + yc1 + "L" + xc2 + "," + yc2
			+ "L" + x2elbow1 + "," + y2elbow1 + "L" + x2 + "," + y2 + "Z";

}

function drawOneWayBendedFlowWithArrow(x1, y1, x2, y2, flowsize, sourceSize,
		targetSize) {

	var ndsize0 = Math.sqrt(sourceSize) / 3;
	var ndsize3 = Math.sqrt(targetSize) / 3;
	var width = Math.sqrt(flowsize);
	var dx = Math.abs(x2 - x1);
	var dy = Math.abs(y2 - y1);
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist < (ndsize0 + ndsize3) * 1.6)
		return;

	var haselbow = true;

	// Shorten the length so that the line only touches the node circle
	if (haselbow) {
		x1 = x1 + (x2 - x1) * ndsize0 / dist;
		y1 = y1 + (y2 - y1) * ndsize0 / dist;
		x2 = x2 - (x2 - x1) * ndsize3 / (dist - ndsize0);
		y2 = y2 - (y2 - y1) * ndsize3 / (dist - ndsize0);
	}

	// Four corners of a flow line
	var xc1 = null, yc1 = null, xc2 = null, yc2 = null;
	// Four points to round the head
	var x2elbow1 = null, y2elbow1 = null;
	var sign = 1;
	var xdelta = null, ydelta = null, xarrowdelta = null, yarrowdelta = null, xgap = null, ygap = null;
	var gap = width * 0.05;
	if (y1 == y2) { // horizontal
		xdelta = 0;
		ydelta = width / 2;
		xarrowdelta = 0;
		yarrowdelta = width / 1.0;
		xgap = 0;
		ygap = gap;
	} else if (x1 == x2) { // vertical
		ydelta = 0;
		xdelta = width / 2;
		yarrowdelta = 0;
		xarrowdelta = width / 1.0;
		xgap = gap;
		ygap = 0;
	} else {
		var v = (x2 - x1) / (y1 - y2);
		xdelta = width / 2.0 / Math.sqrt(1 + v * v);
		ydelta = Math.abs(xdelta * v);
		xarrowdelta = width / Math.sqrt(1 + v * v);
		yarrowdelta = Math.abs(xarrowdelta * v);
		xgap = gap / Math.sqrt(1 + v * v);
		ygap = Math.abs(xgap * v);
		if (v > 0)
			sign = -1;
	}
	x1 = (y1 > y2) ? x1 + xgap : x1 - xgap;
	x2 = (y1 > y2) ? x2 + xgap : x2 - xgap;
	y1 = (x1 > x2) ? y1 - ygap : y1 + ygap;
	y2 = (x1 > x2) ? y2 - ygap : y2 + ygap;

	xc1 = (y1 > y2) ? x1 + xdelta / 2 : x1 - xdelta / 2;
	yc1 = (x1 > x2) ? y1 - ydelta / 2 : y1 + ydelta / 2;
	yc2 = (x1 > x2) ? y2 - ydelta + 2.5 * xdelta * sign : y2 + ydelta - 2.5
			* xdelta * sign;
	xc2 = (y1 > y2) ? x2 + xdelta + 2.5 * ydelta * sign : x2 - xdelta - 2.5
			* ydelta * sign;

	x2elbow1 = (y1 > y2) ? x2 + xarrowdelta + 2.5 * ydelta * sign : x2
			- xarrowdelta - 2.5 * ydelta * sign;
	y2elbow1 = (x1 > x2) ? y2 - yarrowdelta + 2.5 * xdelta * sign : y2
			+ yarrowdelta - 2.5 * xdelta * sign;

	var arcxdelta = xdelta * dist / 4 / flowsize;
	var arcydelta = ydelta * dist / 4 / flowsize;
	var x13rd = (y1 > y2) ? x1 + arcxdelta : x1 - arcxdelta;
	var y13rd = (x1 > x2) ? y1 - arcydelta : y1 + arcydelta;
	var x23rd = (y1 > y2) ? x1 + (x2 - x1) / 3 + arcxdelta : x1 + (x2 - x1) / 3
			- arcxdelta;
	var y23rd = (x1 > x2) ? y1 + (y2 - y1) / 3 - arcydelta : y1 + (y2 - y1) / 3
			+ arcydelta;
	arcxdelta = arcxdelta + xdelta;
	arcydelta = arcydelta + ydelta;
	var xc13rd = (y1 > y2) ? x1 + arcxdelta : x1 - arcxdelta;
	var yc13rd = (x1 > x2) ? y1 - arcydelta : y1 + arcydelta;
	var xc23rd = (y1 > y2) ? x1 + (x2 - x1) / 3 + arcxdelta : x1 + (x2 - x1)
			/ 3 - arcxdelta;
	var yc23rd = (x1 > x2) ? y1 + (y2 - y1) / 3 - arcydelta : y1 + (y2 - y1)
			/ 3 + arcydelta;

	return "M" + x1 + "," + y1 + " L" + xc1 + "," + yc1 + " C" + xc13rd + ","
			+ yc13rd + " " + xc23rd + "," + yc23rd + " " + xc2 + "," + yc2
			+ "L" + x2elbow1 + "," + y2elbow1 + " L" + x2 + "," + y2 + "C"
			+ x23rd + "," + y23rd + " " + x13rd + "," + y13rd + " " + x1 + ","
			+ y1;

}
