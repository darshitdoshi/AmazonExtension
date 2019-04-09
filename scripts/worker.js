// get the price of the current selection
function getPrice() {
	var price = "Unavailable";
	var price_block = document.getElementById('priceblock_ourprice');
	if(price_block) {
		price = price_block.innerHTML;
	}
	return price;
}

//sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentTabURL() {
	var url = '';
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	url = tabs[0].url;
	});
	return url;
}

self.addEventListener('message', function(e) {
	console.log(e);

	var link = e.data[0];
	var color_obj = e.data[1];
	
	// chrome.tabs.create({url : link});

	var color = available_color_array[i].getElementsByClassName('imgSwatch')[0].alt;
	color_obj.getElementsByClassName('imgSwatch')[0].click();
	await sleep(2000);

	var price = getPrice();
	var url = getCurrentTabURL();
	var color_price_obj = {'price' : price, 'color' : color, 'url' : url};

	self.postMessage(color_price_obj);
}, false);