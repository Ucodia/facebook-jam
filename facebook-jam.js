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

			var $header = $story.find("._1dwg").first();
			$header.prepend("<div class='facebook-jam-expander'><a>Show</a></div>");

			// TODO: get the click event to work on the link instead of the header
			$header.click(function () {
				$content.toggleClass("facebook-jam-collapsed");
				var collapsed = $content.hasClass("facebook-jam-collapsed");
				$(this).find(".facebook-jam-expander a").text(collapsed ? "Show" : "Hide");
			});
		});

		subscribe();
	}

	subscribe();
})();
