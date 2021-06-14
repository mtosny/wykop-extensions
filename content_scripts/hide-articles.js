var hiddenArticlesStorageFactory = function(storedData){
	
	var storedData = storedData;
	
	var initializeHiddenArticlesWhenNeeded = function(){
		if (!storedData.hiddenArticles){
			storedData.hiddenArticles = {};
		}
	};
	
	var isArticleHidden = function(articleLinkUrl){
		return !!storedData.hiddenArticles[articleLinkUrl];
	}
	
	var setLinkAsHidden = function(link){
		storedData.hiddenArticles[link] = {hidingTime: Date.now()};
		browser.storage.local.set(storedData);
	}
	
	initializeHiddenArticlesWhenNeeded();
	
	return {
		isArticleHidden: isArticleHidden,
		setLinkAsHidden: setLinkAsHidden
	};
};

var hiddenArticlesUiServiceFactory = function(hiddenArticlesStorage){	
	var hiddenArticlesStorage = hiddenArticlesStorage;
	
	var createHideButton = function(articleNode){
		var hideButton = document.createElement("button");
		hideButton.innerText = "ukryj";
		hideButton.setAttribute("data-link", this.getArticleLinkUrl(articleNode));
		hideButton.onclick = function(){
			var articleLinkUrl = this.getAttribute("data-link");
			hiddenArticlesStorage.setLinkAsHidden(articleLinkUrl);
			hideArticle(articleNode);
		};
		articleNode.querySelector("h2").appendChild(hideButton);
	};
	
	var getArticleLinkUrl = function(articleNode){
		return articleNode.querySelector("h2 > a").getAttribute("href");
	};
	
	var getArticleNodes = function(){
		return document.querySelectorAll("div.article");
	};
	
	var hideArticle = function(articleNode){
		articleNode.classList.add("blacklisted");
	};
	
	var isArticleHidden = function(articleNode){
		var articleLinkUrl = getArticleLinkUrl(articleNode);
		return hiddenArticlesStorage.isArticleHidden(articleLinkUrl);
	};
	
	return {
		createHideButton: createHideButton,
		getArticleLinkUrl: getArticleLinkUrl,
		getArticleNodes: getArticleNodes,
		hideArticle: hideArticle,
		isArticleHidden: isArticleHidden
	};
};

try {
	browser.storage.local.get().then(storedData => {
		var hiddenArticlesStorage = new hiddenArticlesStorageFactory(storedData);
		var service = new hiddenArticlesUiServiceFactory(hiddenArticlesStorage);
		
		var articleNodes = service.getArticleNodes();		
		for (var articleNode of articleNodes)
		{			
			if (service.isArticleHidden(articleNode)){
				service.hideArticle(articleNode);
			}
			
			service.createHideButton(articleNode);
		}
	});	
}
catch (error) {
	console.error("WykopPlExtensions: ", error);
}