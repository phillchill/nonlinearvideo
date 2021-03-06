var lastOverlayNumber;
var choiceTimeout;
var choiceTimeoutCount;

var choiceTimeoutDuration = 5; // Duration in seconds

// run this when the page has finished loading
$(document).ready( function() {

	// INITIALIZE VIDEOS
	// (every additional video has to be referenced here with a unique ID,
	// based on the ID of the respective video element in index.html)

	var video1 = Popcorn('#video1');
	var video2 = Popcorn('#video2');
	var video3 = Popcorn('#video3');
	var videos = [video1, video2, video3];

	// show first video
	$("#video1").show();

	// at the end of each video, resume to the last decision overlay
	$("video").each( function() {
		$(this).get(0).addEventListener("ended", function(e) {
			if (lastOverlayNumber) {
				showOverlay(lastOverlayNumber);
			} else {
				showOverlay(1);
			}
		});

		// cover video with overlay once a video starts playing, 
		// so it can be clicked to play initially
		$(this).get(0).addEventListener("play", function(e) {
			$("#overlayWrapper").show();
		});
	});


	/*************************************************************************
	* (TIMEBASED) EVENTS FOR VIDEO 1
	*************************************************************************/

	/***************************************
	* Example 1: Show Footnote
	* (start, end), look at
	* http://popcornjs.org/popcorn-docs/plugins/#Image
	***************************************/
	// From section 1 to 5 in video 1, show footnote
	// target specifies the element id, in which the footnote should be shown
	video1.footnote({
       start: 1,
       end: 5,
       text: 'Hello Footnote!',
       target: "footnotediv"
     });

	/***************************************
	* Example 2: Show Webpage
	* (start, end), look at
	* http://popcornjs.org/popcorn-docs/plugins/#Webpage
	***************************************/

	// From second 7 to 11 in video 1, show website
	// "exampleWebsite1" is the element id, in which the website should be shown,
	// in our case a DIV, that is position:absolute on top of the video (see style.css)
	video1.webpage({
		id: "test1",
		start: 7,
		end: 11,
		src: "http://example.com/",
		target: "exampleWebsite1"
	});

	/***************************************
	* Example 3: Decision Overlay
	***************************************/

	// Pause video 1 at 5 seconds and show decision overlay
	video1.cue(12, function() {
		
		video1.pause();

		// show overlay 1
		showOverlay(1);
	});


	/*************************************************************************
	* (TIMEBASED) EVENTS FOR VIDEO 2
	*************************************************************************/

	/***************************************
	* Example 3: Show Webpage
	* (start, end), look at
	* http://popcornjs.org/popcorn-docs/plugins/#Webpage
	***************************************/

	// From second 4 to 8 in video 2, show website
	// "exampleWebsite2" is the element id, in which the website should be shown,
	// in our case a DIV, that is position:absolute on top of the video (see style.css)
	video2.webpage({
		id: "test1",
		start: 6,
		end: 8,
		src: "http://example.com",
		target: "exampleWebsite2"
	});

	/***************************************
	* Example 4: Decision Overlay
	* (with Timeout and background image)
	***************************************/

	// Pause video 2 at 12 seconds and show decision overlay
	video2.cue(12, function() {
		
		video2.pause();

		// show overlay 2
		showOverlay(2);
	});


	/*************************************************************************
	* (TIMEBASED) EVENTS FOR VIDEO 3
	*************************************************************************/

	/***************************************
	* Example 5: Decision Overlay
	***************************************/

	// Pause video 3 at 4 seconds and show decision overlay
	video3.cue(4, function() {
		
		video3.pause();

		// show overlay 3
		showOverlay(3)
	});

	/***************************************
	* Helper functions for Decision Overlays
	***************************************/

	// show overlay with number n
	function showOverlay (n) {
		var $overlay = $(".choiceOverlay:eq("+(n-1)+")");
		var $video = $("#video"+(n));
		var $counter = $("#choiceOverlayCounter");

		$overlay.show();

		// What should happen when a choice is made?
		var prevVid = n - 1;
		var nextVid = n + 1;
		if (prevVid < 1) {prevVid = videos.length};
		if (nextVid > videos.length) {nextVid = 1};

		// clear counter and overlay
		$overlay.children(".action").click(function () {
			// stop timeout, as something was chosen
			window.clearInterval(choiceTimeout);
			
			// hide counter, overlays & videos
			$counter.hide();
			$(".choiceOverlay").hide();
			$("video").hide();

			// save last overlay & video to resume at video end
			lastChoiceOverlay = $overlay;
			lastOverlayNumber = n;
		});
		// startVideo for actions
		$overlay.children(".red").click(function () {
			startVideo(1);
		});
		$overlay.children(".green").click(function () {
			startVideo(2);
		});
		$overlay.children(".blue").click(function () {
			startVideo(3);
		});

		
		// After a certain timespan, go back to the video
		// (duration is defined in choiceTimeoutDuration)
		choiceTimeoutCount = choiceTimeoutDuration;
		$counter.text(choiceTimeoutCount).show();

		choiceTimeout = window.setInterval(function() {
			
			if (choiceTimeoutCount <= 0) {
				
				window.clearInterval(choiceTimeout);
				$counter.hide();
				$overlay.hide();

				// save last overlay & video to resume at video end
				lastChoiceOverlay = $overlay;
				lastOverlayNumber = n;
				
				videos[n-1].play();

			} else {
				choiceTimeoutCount--;
				$counter.text(choiceTimeoutCount);
			}
		}, 1000); // execute every 1 seconds
	}

	// start a specific video
	function startVideo (videoNumber) {
		// show and play video videoNumber at a certain position (0 seconds)
		$("#video"+videoNumber).show();
		videos[videoNumber-1].play(0);
	}

}); // document ready
