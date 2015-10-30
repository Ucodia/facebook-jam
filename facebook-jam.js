(function () {
	var $timeline = $("#contentArea");

	if ($timeline.length == 0)
		return;

	chrome.runtime.sendMessage({ topic: 'showPageAction' });

	function subscribe() {
		$timeline.bind("DOMSubtreeModified", updateJam);
	}

	function unsubscribe() {
		$timeline.unbind("DOMSubtreeModified", updateJam);
	}

	function updateJam() {
		var $stories = $timeline.find("div[data-testid='fbfeed_story']").filter(function (i) {
			var d = $(this).data();
			return d.hasOwnProperty('timestamp')
		});

		unsubscribe();

		$.each($stories, function (i, story) {
			var $story = $(story);
			if ($story.find("._5mxv").length > 0) {
				var $a = $story.find("._3x-2");
				$a.addClass("facebook-jam-collapsed");
			}
		});

		subscribe();
	}

	subscribe();
})();
