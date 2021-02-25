window.quitFinsemble = function quitFinsemble() {
	//console.log("Quit button successfully triggered");
	FSBL.shutdownApplication();
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", init);
} else {
	window.addEventListener("FSBLReady", init);
}

function init() {
	window.launchTutorial = function launchTutorial() {
		FSBL.System.openUrlWithBrowser(
			"https://nepseview.com",
			() => {
				//console.log("successfully launched docs");
			},
			(err) => {
				//console.log("failed to launch docs");
			}
		);
	};
}
