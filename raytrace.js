var math = require('mathjs');
var fs = require('fs');
var PNGImage = require('pngjs-image');
// returns t
// 
function IntersectsWithSphere(eye, rayDirection, sphereCenter, sphereRadius)
{
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

function GetPixelColor(img, x, y)
{
	var index = img.getIndex(y, x);
	return { red: img.getRed(index), green: img.getGreen(index), blue: img.getBlue(index), alpha: img.getAlpha(index) }
}

function Phong(lightVector, surfaceNormal, surfacePosition,  viewDirection, sphereColor)
{
	
	var ambient = math.multiply(sphereColor.ambient, sphereColor.ambientCoefficient);
	
	
	//var lightDirection = math.matrix([-1, 0.0, -1]);
	var lightDirection = math.subtract(lightVector, surfacePosition);
	var normalizedLightDirection = normalize(lightDirection);
	var normalDotLightDirection = math.dot(normalizedLightDirection, surfaceNormal);
	var diffuse = math.multiply(sphereColor.diffuse, math.max(normalDotLightDirection, 0) * sphereColor.diffusePower);
	

	
	var H = normalize(math.divide(math.add(normalizedLightDirection, viewDirection), 2));
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

function normalize(vector)
{
	return math.divide(vector, math.norm(vector));
}

var m = 500;
var k = 500;

var aspectRatio = m / k;
var w = 0.5;

var eyePosition = math.matrix([0.0, 0.0, -1]);
var lightPosition = math.matrix([-200, 200, -500]);



function RayPlaneIntersection(planeY, rayOrigin, rayDirection)
{
	var T = math.add(rayOrigin, math.matrix([0, planeY, 0]));

	var theta = math.dot(normalize(rayDirection), math.matrix([0, 1, 0]));
	//console.log(theta);
	if (theta <= 0)
	{
		return null;
	}
	var d = planeY / theta;
	return math.add(rayOrigin, math.multiply(rayDirection, d));
}


var image = PNGImage.createImage(m, k);
var pixelY = 0;

var colorA = {
	specular: [1.0, 1.0, 1.0],
	diffuse: [0.0, 1.0, 1.0],
	ambient: [0.0, 1.0, 1.0],
	ambientCoefficient: 0.2, // <=1, >0
	specularHardness: 20,
	diffusePower: 0.6,
	specularPower: 0.75
}

var colorB = {
	specular: [1.0, 1.0, 1.0],
	diffuse: [0.0, 1.0, 0.0],
	ambient: [0.0, 1.0, 0.0],
	ambientCoefficient: 0.2, // <=1, >0
	specularHardness: 20,
	diffusePower: 0.6,
	specularPower: 0.75

}

var colorC = {
	specular: [1.0, 1.0, 1.0],
	diffuse: [0.7, 1.0, 1.0],
	ambient: [0.7, 0.0, 1.0],
	ambientCoefficient: 0.2, // <=1, >0
	specularHardness: 20,
	diffusePower: 0.6,
	specularPower: 0.75
}

// var colorD = {
	// specular: [1.0, 1.0, 1.0],
	// diffuse: [1.0, 1.0, 1.0],
	// ambient: [1.0, 0.0, 1.0],
	// ambientCoefficient: 0.2, // <=1, >0
	// specularHardness: 100,
	// diffusePower: 0.6,
	// specularPower: 0.75

// }

var colorD = {
	specular: [1.0, 0.2, 1.0],
	diffuse: [1.0, 0.2, 1.0],
	ambient: [1.0, 0.2, 1.0],
	ambientCoefficient: 0.2, // <=1, >0
	specularHardness: 100,
	diffusePower: 0.6,
	specularPower: 0.5
}

// var ellipsoid = 
// {
	// M: math.matrix([1, 0, 0], [0, 1, 0], [0, 0, 1]),
	// c: [0, 0, 0]
// }


function RayEllipsoidIntersection(rayOrigin, rayDirection, ellipsoid)
{
	var inverseDirection = math.matrix([1.0/rayDirection[0], 1.0/rayDirection[1], 1.0/rayDirection[2]]);
	var tSquared = math.multiply(inverseDirection, math.subtract(epllipsoid.M, rayOrigin));
}


var sphereCenterRadiusTuples = [

	//[math.matrix([0.0, -10, 2.0]), 10, sphereColor],

		// ground
		//[math.matrix([0.0, 1.1, 15.0]), 2.0, colorA],

			// // right column
		// [math.matrix([0.0, 1.5, 12.0]), 0.5, colorA],
		// [math.matrix([0.0, 0.5, 12.0]), 0.5, colorA],
		// [math.matrix([0.0, -0.5, 12.0]), 0.5, colorC],
				// // middle column
		// [math.matrix([-.5, 1.0, 11.0]), 0.5, colorA],
		// [math.matrix([-.5, 0, 11.0]), 0.5, colorC],
		// [math.matrix([-.5, -1.0, 11.0]), 0.5, colorB],
		
		// // left column
		// [math.matrix([-1.0, 0.5, 10.0]), 0.5, colorC],
		// [math.matrix([-1.0, -0.5, 10.0]), 0.5, colorB],
		// [math.matrix([-1.0, -1.5, 10.0]), 0.5, colorA],
];

for (z = 8.0; z < 80.0; z+= 8.0)
{
	for ( x = 0.0; x <= 32.0; x += 8.0)
	{
		sphereCenterRadiusTuples.push([math.matrix([x, -2.0, z]), 0.5, colorA]);
	}
}

sphereCenterRadiusTuples.push([math.matrix([-10, 10.0, 60]), 1.0, colorD]);
sphereCenterRadiusTuples.push([math.matrix([0.0, 10.0, 90.0]), 1.0, colorD]);

sphereCenterRadiusTuples.reverse();
var wall = []
// for (i = 1; i < 20; i+= 5)
// {
	// sphereCenterRadiusTuples.push([math.matrix([2.0 + ( i * .5), 8.5 - ( i * .5) , 40.0 - i]), 0.5, colorA]);
	// sphereCenterRadiusTuples.push([math.matrix([2.0 + ( i * .5), 7.5 - ( i * .5) , 40.0 - i]), 0.5, colorA])
	// sphereCenterRadiusTuples.push([math.matrix([2.0 + ( i * .5), 6.5 - ( i * .5) , 40.0 - i]), 0.5, colorA]);
// }

// for (i = 1; i < 20; i++)
// {
	// sphereCenterRadiusTuples.push([math.matrix([2.0, -4.0 + i , 12.0]), 0.5, colorA]);
	// sphereCenterRadiusTuples.push([math.matrix([-2.0, -4.0 + i , 12.0]), 0.5, colorA]);
// }

function Render(eyePosition, rayVector, sphereCenter, sphereRadius, sphereColor)
{
	var pointOfIntersection = math.add(eyePosition, math.multiply(rayVector, t));
	var surfaceNormal = math.subtract(pointOfIntersection, sphereCenter);
	return Phong(lightPosition, normalize(surfaceNormal), pointOfIntersection, eyePosition, sphereColor);
}


for (i = -0.5; i < 0.5; i += (1.0 / k))
{
	var pixelX = 0;
	for (j = 0.5 * aspectRatio; j > -0.5 * aspectRatio; j -= (1.0 / m))
	{
		var windowPoint = math.matrix([i, j, w]);
		var rayVector = math.subtract(windowPoint, eyePosition);
		var intersects = false;
		for (var objectIndex = 0; objectIndex < sphereCenterRadiusTuples.length; objectIndex++)
		{

			var sphereCenter = sphereCenterRadiusTuples[objectIndex][0];
			var sphereRadius = sphereCenterRadiusTuples[objectIndex][1];
			var sphereColor = sphereCenterRadiusTuples[objectIndex][2];
			// var color = Render(eyePosition, rayVector, sphereCenter, sphereRadius, sphereColor);
			// image.setAt(pixelY, pixelX, { red: color[0], green: color[1], blue: color[2], alpha: 255 });	
			var t = IntersectsWithSphere(eyePosition, rayVector, sphereCenter, sphereRadius);
			if (t != null)
			{
				intersects = true;
				var color = Render(eyePosition, rayVector, sphereCenter, sphereRadius, sphereColor);
				image.setAt(pixelY, pixelX, { red: color[0], green: color[1], blue: color[2], alpha: 255 });			
			}
			if (!intersects)
			{
				image.setAt(pixelY, pixelX, { red: 200, green: 50, blue: 255, alpha: 255 });
			}

		}

		pixelX++;
	}
	pixelY++;
}

var superSampleWidth = image.getWidth();
var superSampleHeight = image.getHeight();


var aliasedImage = PNGImage.createImage(superSampleWidth / 2, superSampleHeight/ 2);
for (x = 2; x < superSampleWidth - 1; x+=2)
{
	for (y = 2; y < superSampleHeight - 1; y+=2)
	{
		var neighbors = [
			GetPixelColor(image, x -1, y), 
			GetPixelColor(image, x - 1, y - 1),
			GetPixelColor(image, x, y - 1), 
			GetPixelColor(image, x + 1, y - 1), 
			GetPixelColor(image, x + 1, y), 
			GetPixelColor(image, x + 1, y + 1), 
			GetPixelColor(image, x, y + 1),
			GetPixelColor(image, x - 1, y + 1),
			GetPixelColor(image, x, y),
		];
		var newPixel = { red: 0, green: 0, blue: 0, alpha: 0};
		
		for (i = 0; i < 9; i++)
		{
			newPixel.green += neighbors[i].green;
			newPixel.red += neighbors[i].red;
			newPixel.blue += neighbors[i].blue;
			newPixel.alpha += neighbors[i].alpha;
		};
		newPixel.green /= 9;
		newPixel.red /= 9;
		newPixel.blue /= 9;
		newPixel.alpha /= 9;
		
		
		aliasedImage.setAt(y/2, x/2, newPixel);
	}
}

if (fs.existsSync())
{
	fs.unlinkSync('output.png');
	fs.unlinkSync('SuperOutput.png');
}

image.writeImage('SuperOutput.png',  (err) => {
	if (err) throw err;
});
aliasedImage.writeImage('output.png',  (err) => {
	if (err) throw err;
});