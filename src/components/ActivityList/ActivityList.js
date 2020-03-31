const FSBLReady = () => {
	try {
		// Do things with FSBL in here.
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}

const init = () => {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var actionList = JSON.parse(this.responseText);
			let activityList = document.getElementById('activityList')
			for(var i=0;i<actionList.length;i++){
				let action = actionList[i]
				let activityNode = document.createElement("div");   
				activityNode.innerHTML = action.user+'&nbsp;&nbsp;&nbsp;&nbsp;'+action.action.type+'&nbsp;&nbsp;&nbsp;&nbsp;'+action.action.url+'&nbsp;&nbsp;&nbsp;&nbsp;'+action.timestamp
				activityList.appendChild(activityNode)
				activityList.appendChild(document.createElement("br"))
			}
		}
	};
	xhttp.open("POST", "http://localhost:3375/pull_useractivity", true);
	xhttp.send();
}
window.onload = init