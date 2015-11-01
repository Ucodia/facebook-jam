(function () {
	var $timeline = $("#contentArea");

	if ($timeline.length == 0)
		return;

	var jammed = {};
	var lastHeight = 0;
	var updateCount = 0;

	chrome.runtime.sendMessage({ topic: 'showPageAction' });

	function subscribe() {
		// TODO: find a better hook to trigger refresh
		$timeline.bind("DOMSubtreeModified", updateJam);
	}

	function unsubscribe() {
		$timeline.unbind("DOMSubtreeModified", updateJam);
	}

	function updateJam() {
		var newHeight = $timeline.height();
		if (lastHeight >= newHeight)
			return;

		lastHeight = newHeight;
		updateCount++;

		// find new stories
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

			var $header = $story.find("._1dwg").first();
			var $link = $("<a>Show</a>");
			$header.prepend($("<div class='facebook-jam-expander'></div>").append($link));

			$link.click(function () {
				$content.toggleClass("facebook-jam-collapsed");
				var collapsed = $content.hasClass("facebook-jam-collapsed");
				$link.text(collapsed ? "Show" : "Hide");
			})
		});

		subscribe();
	}

	subscribe();
})();
