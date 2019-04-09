// send the page title as a chrome message
function getTitle() {
	var title = document.title;
	return title;
}

//get the size of current selected object
function getCurrentSize() {
	// list of all available sizes
	var current_size_obj = document.getElementById('native_dropdown_selected_size_name').getElementsByClassName('dropdownSelect')[0];
	var current_size_text = current_size_obj.innerHTML;
	return current_size_text;
}

//get the page specific key, which is title+size
function getDocKey() {
	var title = getTitle();
	var size = getCurrentSize();
	var key = title.concat('+Size=', size);
	return key;
}

function getCurrentTabURL() {
	var url = '';
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	url = tabs[0].url;
	});
	return url;
}

// get the price of the current selection
function getPrice() {
	var price = "Unavailable";
	var price_block = document.getElementById('priceblock_ourprice');
	if(price_block) {
		price = price_block.innerHTML;
	}
	return price;
}

// get all available colors
function getColors() {
	
	var color = document.getElementById('variation_color_name').getElementsByClassName('a-row')[0].innerHTML;
	var available_color_array = document.getElementsByClassName('swatchAvailable');
	//selected color has a different class, so handle separately
	var selected_color = document.getElementsByClassName('swatchSelect')[0];
	var colors = '';
	//string of all colors under current selection
	colors = selected_color.getElementsByClassName('imgSwatch')[0].alt;
	for(var i = 0; i < available_color_array.length; i++) {
		colors = colors.concat(', ');
		colors = colors.concat(available_color_array[i].getElementsByClassName('imgSwatch')[0].alt);
	}

	return colors;
}

//sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//get all available colors with their prices
async function getColorsWithPrice(callback) {
	var title = getTitle();
	var doc_key = getDocKey();
	var size = getCurrentSize();
	var url = getCurrentTabURL();

	var color_price_array = new Array(); 
	var color = document.getElementById('variation_color_name').getElementsByClassName('a-row')[0].innerHTML;
	var available_color_array = document.getElementsByClassName('swatchAvailable');
	//selected color has a different class, so handle separately
	var selected_color = document.getElementsByClassName('swatchSelect')[0];

	//string of all colors under current selection
	var color = selected_color.getElementsByClassName('imgSwatch')[0].alt;
	selected_color.getElementsByClassName('imgSwatch')[0].click();
	var price = getPrice();
	var color_price_obj = {'price' : price, 'color' : color};
	color_price_array.push(color_price_obj);

	for(var i = 0; i < available_color_array.length; i++) {
		var worker = new Worker('worker.js');
		worker.addEventListener('message', function(e) {
			color_price_array.push(e.data);
			var color_price_response = {'title' : title, 'size' : size, 'price_dict' : color_price_array};
			chrome.storage.local.set({[doc_key] : color_price_response}, function() {
				console.log("Object stored");
			});
			callback(color_price_response);
		});

		worker.postMessage([getCurrentTabURL(), available_color_array[i]]);
		// color_price_array.push(color_price_obj);
	}
	
	
	// return color_price_array;
}

//return just the array of color objects 
async function getColorObjects(callback) {
	var title = getTitle();
	var doc_key = getDocKey();
	var size = getCurrentSize();

	var color_array = new Array(); 
	var color = document.getElementById('variation_color_name').getElementsByClassName('a-row')[0].innerHTML;
	var available_color_array = document.getElementsByClassName('swatchAvailable');
	//selected color has a different class, so handle separately
	var selected_color = document.getElementsByClassName('swatchSelect')[0];
	color_array.push(selected_color);
	for(var i = 0; i < available_color_array.length; i++) {
		color_array.push(available_color_array[i]);
		var worker = new Worker('worker.js');
		worker.postMessage(['www.google.com', 'abcd']);
	}

	var color_object_response = {'title' : title, 'size' : size, 'color_array' : color_array};

	callback(color_object_response);


}

function getScrapedResult() {
	var title = getTitle();
	var doc_key = getDocKey();
	var current_size_text = getCurrentSize();

	chrome.storage.local.get([doc_key], function(result) {
			if(Object.getOwnPropertyNames(result).length > 0) {
				console.log(result[doc_key]);
				chrome.runtime.sendMessage(result[doc_key]);
			}

			// else {
			// 	getColorsWithPrice(function(color_price_response) {
			// 	chrome.runtime.sendMessage(color_price_response);
			// 	});
			// }

			else {
				getColorObjects(function (color_object_response) {
					console.log(color_object_response);
					chrome.runtime.sendMessage(color_object_response);
				});
			}
		});

}

//main
getScrapedResult();


// chrome.runtime.sendMessage(getColorsWithPrice("Small"));