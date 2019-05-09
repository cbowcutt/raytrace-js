var math = require('mathjs');
var normalize = require('./normalize');
var exports = {};

exports.Phong = (lightVector, surfaceNormal, surfacePosition,  viewDirection, sphereColor) => {
	
	var ambient = math.multiply(sphereColor.ambient, sphereColor.ambientCoefficient);
	
	
	//var lightDirection = math.matrix([-1, 0.0, -1]);
	var lightDirection = math.subtract(lightVector, surfacePosition);
	var normalizedLightDirection = normalize.Normalize(lightDirection);
	var normalDotLightDirection = math.dot(normalizedLightDirection, surfaceNormal);
	var diffuse = math.multiply(sphereColor.diffuse, math.max(normalDotLightDirection, 0) * sphereColor.diffusePower);
	

	
	var H = normalize.Normalize(math.divide(math.add(normalizedLightDirection, viewDirection), 2));
	var normalDotH = math.max(math.dot(surfaceNormal,  H), 0);
	var specularIntensity = math.pow(normalDotH * normalDotH, sphereColor.specularHardness);
	var specular = math.multiply(sphereColor.specular, specularIntensity * sphereColor.specularPower);


	
	var toReturn = math.add(specular, ambient, diffuse);
	for (var i = 0; i < 3; i++)
	{
		toReturn[i] *= 255;
		if (toReturn[i] > 255) { toReturn[i] = 255; }
	}
	return toReturn;
}


module.exports = exports;