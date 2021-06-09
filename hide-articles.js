try {
	var gettingStoredStats = browser.storage.local.get();
	gettingStoredStats.then(results => {
		
		var setLinkAsHidden = function(link){
			results.hiddenArticles[link] = {hidingTime: Date.now()};
			browser.storage.local.set(results);
		}
		
		var hideArticle = function(h2Element){
			h2Element.parentElement.parentElement.classList.add("blacklisted");
		};
		
		if (!results.hiddenArticles){
			results.hiddenArticles = {};
		}
		
		var articles = document.getElementsByTagName("h2");
		
		for (var i=0; i<articles.length; i++)
		{
			var article = articles[i];
			
			var articleLink = article.getElementsByTagName("a")[0].getAttribute("href");
			
			if (results.hiddenArticles[articleLink]){
				hideArticle(article);
			}
			
			var hideButton = document.createElement("button");
			hideButton.innerText = "hide";
			hideButton.onclick = function(){
				var articleLink = this.getAttribute("data-link");
				setLinkAsHidden(articleLink);
				hideArticle(this.parentElement);
			};
			
			hideButton.setAttribute("data-link", articleLink);
			
			article.appendChild(hideButton);
		}
		
	});
	
}
catch (error) {
	console.error("WykopPlExtensions: ", error);
}