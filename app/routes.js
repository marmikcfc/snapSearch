//var Todo = require('./models/todo');
var AlchemyAPI = require('./models/alchemyapi');
var alchemyapi = new AlchemyAPI();

var demo_url = '';
var texttype = 'image';
var fs = require('fs'),
    request = require('request');

module.exports = function(app) {

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		var urlRegex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		var output = {};
		var myText = req.body.text;
		console.log(myText);
		// download image
		var base64Data = myText.replace(/^data:image\/jpeg;base64,/, "");

		require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
		  console.log(err);
		});
		if (myText.match(urlRegex)) {
			texttype = 'url';
		} else {
			texttype = 'image';
			myText="out.png";

		}
		demo_url = myText
		console.log("Processing "+texttype +" - " + myText);
		image(req, res, output);
		//imageFaceTags(req, res, output);
		//imageTextTags(req, res, output);
	});

	function image(req, res, output) {
		alchemyapi.image('url', demo_url, {}, function(response) {
			output['image'] = { url:demo_url, response:response, results:response };
			console.log(output['image']);
			imageFaceTags(req, res, output);
		});
	}

	function imageFaceTags(req, res, output) {
		alchemyapi.imageFaceTags(texttype, demo_url, {}, function(response) {
			output['imageFaceTags'] = { url:demo_url, response:response, results:response };
			console.log(output['imageFaceTags']);
			imageTextTags(req, res, output);
		});
	}
	function imageTextTags(req, res, output) {
		alchemyapi.imageTextTags(texttype, demo_url, {}, function(response) {
			output['imageTextTags'] = { url:demo_url, response:response, results:response };
			console.log(output['imageTextTags']);
			image_keywords(req, res, output);
		});
	}
	function image_keywords(req, res, output) {
		alchemyapi.image_keywords(texttype, demo_url, {}, function(response) {
			output['image_keywords'] = { url:demo_url, response:response, results:response };
			console.log(output['image_keywords']);
			console.log("Data processing: End");
			res.json(output); // return all rules in JSON format
		});
	}

}

