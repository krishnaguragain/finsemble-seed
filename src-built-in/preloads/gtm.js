/*
	Google Tag Manager Preload
	==========================
	Google Tag Manager can track:
	- page views (these are the component views / windows)
	- element interactions - button clicks
	- javascript errors
	and more

	The three actions listed above need no extra code and can be done via GTM directly.

	Once integrated with GTM it is best to use Google Analytics but alternatives can be used.


	Instructions for use:
	Add to each component you would like to track via the config file i.e.
		presentationalComponents.json / components.json

	Videos on how to use with Google Analytics:
	1) Create Account - https://drive.google.com/open?id=1-j9dJiy_DKO_2CI29ie4n8HFSQRP1ykU
	2) Intro to interactions - https://drive.google.com/open?id=1-h8vqwGnZpZhJJ-mJdSrFUOg5FUNSaGA
	3) Save your updates ! - https://drive.google.com/open?id=1-e3GP3V_NmM9239N6McUtxLyZfzHGtdz
	4) CSS element clicks / interactions - https://drive.google.com/open?id=1-kdFVrHtksDFun_UE0RUPGDBrjojpy2-
	5) Javascript error logging - https://drive.google.com/open?id=1-XXoFyWDc-BBXuSccd6UyF8WmPKV8QMe
*/

const gtmID = "GTM-55JT28T";

const startGoogleTagManager = () => {
	// includes the GTM script dynamically
	// n.b. this is the recommended approach rather than using webpack require or import
	// ensuring that you are using the most current GTM version

	window.dataLayer = window.dataLayer || [];

	(function (w, d, s, l, i) {
		w[l] = w[l] || [];
		w[l].push({
			"gtm.start": new Date().getTime(),
			event: "gtm.js"
		});
		var f = d.getElementsByTagName(s)[0],
			j = d.createElement(s),
			dl = l != "dataLayer" ? "&l=" + l : "";
		j.async = true;
		j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
		f.parentNode.insertBefore(j, f);
	})(window, document, "script", "dataLayer", gtmID);
};

// add gtm as early as possible
window.addEventListener("DOMContentLoaded", event => {
	startGoogleTagManager();
});
