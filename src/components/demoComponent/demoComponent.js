const FSBLReady = () => {
	try {
		document.getElementById('demoServiceOnBtn').addEventListener('click', demoServiceOn)
		document.getElementById('demoServiceOffBtn').addEventListener('click', demoServiceOff)

		FSBL.Clients.RouterClient.query("serviceOnOffResponder", { "action": 'queryStatus' }, function(error, response) {
			if (!error) {
				if(response.data.service == 'on'){
					document.getElementById('demoServiceOnBtn').style.display = 'none'
					document.getElementById('demoServiceOffBtn').style.display = 'inline'
				}else{
					document.getElementById('demoServiceOnBtn').style.display = 'inline'
					document.getElementById('demoServiceOffBtn').style.display = 'none'
				}
			}
		});

		FSBL.Clients.RouterClient.addListener("demoChannel", function(error,response) {
			if (!error) {
				document.getElementById('message').innerHTML = response.data.message+ ''+ response.data.date;
			}
		});
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const demoServiceOn = (e) => {
	FSBL.Clients.RouterClient.query("serviceOnOffResponder", { "action": 'setServiceOn' }, function(error, response) {
		if (!error) {
			document.getElementById('demoServiceOnBtn').style.display = 'none'
			document.getElementById('demoServiceOffBtn').style.display = 'inline'
		}
	});
}

const demoServiceOff = (e) => {
	FSBL.Clients.RouterClient.query("serviceOnOffResponder", { "action": 'setServiceOff' }, function(error, response) {
		if (!error) {
			document.getElementById('demoServiceOnBtn').style.display = 'inline'
			document.getElementById('demoServiceOffBtn').style.display = 'none'
		}
	});
}


if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}