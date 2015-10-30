(function () {
	var $timeline = $("#contentArea");

	if ($timeline.length == 0)
		return;

	var jammed = {};

	chrome.runtime.sendMessage({ topic: 'showPageAction' });

	function subscribe() {
		$timeline.bind("DOMSubtreeModified", updateJam);
	}

	function unsubscribe() {
		$timeline.unbind("DOMSubtreeModified", updateJam);
	}

	function updateJam() {
		var $stories = $timeline.find("div[data-testid='fbfeed_story']").filter(function (i) {
			var $story = $(this);
			var d = $story.data();
			return d.hasOwnProperty('timestamp') &&
						 $story.find("._5mxv").length > 0 &&
						 jammed.hasOwnProperty(d.dedupekey) === false;
		});

		unsubscribe();

		$.each($stories, function (i, story) {
			var $story = $(story);
			jammed[$story.data().dedupekey] = $story;

			var $content = $story.find("._3x-2").first();
			$content.addClass("facebook-jam-collapsed");
		});

		subscribe();
	}

	subscribe();
})();
