# AmazonExtension

Do you come across a product on Amazon with a price range as wide as the sky? And the lower limit is within your range and the upper limit is way above. Are you relatively insensitive to color/design as compared to the product price, and have to try out a hundred different combinations to find that item which finally lies within your budget? Do you just wish that there could've been a freakin' sort by price option on the page?

### You are at the right place!

Amazon's item lookup API does not work for all products and requires merchant account credentials in its API call.

Maybe we could scrape the webpage!?  
No, unfortunately, Amazon fetches all price information dynamically using javascript calls to its API.

Do we really need to click on all options to find the product in our price range?  
Not really!

This extension solves this product by simulating page clicks on different items and then scrapes the price for the current selection. Additionally, it sorts these items in ascending order and makes it very easy to decide whether you'll find what you are looking for.  
Since size is a factor which usually is fixed, the extension expects you to manually make the size selection before you decide to scrape the product through the extension.

While the scraping process can take time (depending on the response time of Amazon and internet connection), you can navigate to other pages and scrape multiple products at the same time! The scraped information is stored in the browser and you can visit the page again after the scraping process is finished to access your information.
