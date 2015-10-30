(function () {
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.topic === 'showPageAction') {
			chrome.pageAction.show(sender.tab.id);
		}
	});
})();