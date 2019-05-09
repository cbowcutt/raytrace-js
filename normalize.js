var math = require('mathjs');

var exports = {};

exports.Normalize = (vector) => {
	return math.divide(vector, math.norm(vector));
}

module.exports = exports;