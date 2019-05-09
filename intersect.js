var normalize = require('./normalize');
var math = require('mathjs');
var exports = {};

exports.IntersectsWithSphere = (eye, rayDirection, sphereCenter, sphereRadius) => {
	var intersections = [];
	var b = 2.0 * math.dot(rayDirection, math.subtract(eye, sphereCenter));
	var a = math.dot(rayDirection, rayDirection);
	var c = math.subtract(math.dot(math.subtract(eye, sphereCenter), math.subtract(eye, sphereCenter)), math.pow(sphereRadius, 2));
	var d = math.pow(b, 2) - (4.0 * a * c);
	
	if (d > 0)
	{
		var t1 = (-b - d) / (2.0 * a);
		var t2 = (-b + d) / (2.0 * a);
		if (t2 < t1) return t2;
		return t1;
	}
	if (d == 0)
	{
		return -b / (2.0 * a);
	}
	return null;
}

exports.RayPlaneIntersection = (planeY, rayOrigin, rayDirection) => {
	var T = math.add(rayOrigin, math.matrix([0, planeY, 0]));

	var theta = math.dot(normalize.Normalize(rayDirection), math.matrix([0, 1, 0]));
	if (theta <= 0)
	{
		return null;
	}
	var d = planeY / theta;
	return math.add(rayOrigin, math.multiply(rayDirection, d));
}

exports.RayEllipsoidIntersection = (rayOrigin, rayDirection, ellipsoid) => {
	var inverseDirection = math.matrix([1.0/rayDirection[0], 1.0/rayDirection[1], 1.0/rayDirection[2]]);
	var tSquared = math.multiply(inverseDirection, math.subtract(epllipsoid.M, rayOrigin));
}


module.exports = exports;