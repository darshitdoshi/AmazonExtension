// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	//get the url of the current tab
	// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
 //    	var url = tabs[0].url;
 //    	//check if its amazon
 //    	if(url.includes("www.amazon.com")) {
 //    		//get the prices
 //    		chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
	// 			file: 'scripts/payload.js'
	// 		});;
 //    	}
 //    	//if not, redirect to frontpage
 //    	else {
 //    		location.replace('frontpage.html');
 //    		alert('This is not an amazon website');
 //    	}
	// });
	//get the prices
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'scripts/payload.js'
	});;

});

// Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener(function (message) {

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

});