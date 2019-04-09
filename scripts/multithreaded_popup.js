// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {

	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'scripts/multithreaded_payload.js'
	});;

});


function getCurrentTabURL() {
	var url = '';
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	url = tabs[0].url;
	});
	return url;
}

chrome.runtime.onMessage.addListener(function (message) {
	console.log(message);
	var url = getCurrentTabURL();

	var title = message.title;
	var size = message.size;
	var color_array = message.color_array;

	var color_price_array = new Array();

	for(var i = 0; i < color_array.length; i++) {
		var worker = new Worker('worker.js');
		worker.addEventListener('message', function(e) {
			console.log(e);
			color_price_array.push(e.data);

			var message = {'title' : title, 'size' : size, 'price_dict' : color_price_array};
			populateHTML(message);
		});

		worker.postMessage([getCurrentTabURL(), color_array[i]]);
	}
})






// Listen to messages from the payload.js script and write to popout.html
function populateHTML(message) {

	//extract info from message
	console.log(message);
	var title = message.title;
	document.getElementById('pagetitle').innerHTML = title;

	var size = message.size;
	var price_dict = message.price_dict;

	//extract info to sort according to prices
	var sorted = [];
	var dict = {}
	for(object of price_dict) {
		price = object['price'];
		color = object['color'];
		if(dict[price]) {
			dict[price].push(color);
		}

		else{
			dict[price] = [color];
			sorted.push(price);
		}
	}

	//sort values in the dict according to price
	sorted.sort();

	var html = '';
	html = html.concat('<p style="text-align:center;"> SIZE : ', size, '</p>');
	html = html.concat('<table stype="width:150%">');
	html = html.concat('<tr> <th>COLOR</th> <th>PRICE</th> </tr>');
	// for (result of price_dict) {
	// 	html = html.concat('<p> Color : ', result.color, 'Price : ', result.price, '</p>');
	// }
	// document.getElementById('sizesContainer').innerHTML = html;

	for(price of sorted) {
		for(color of dict[price]) {
			// html = html.concat('<p> Color : ', color, 'Price : ', price, '</p>');
			html = html.concat('<tr> <td>', color, '</td> <td>', price, '</td> </tr>');
		}
	}
	html = html.concat('</table>');
	document.getElementById('sizesContainer').innerHTML = html;

}