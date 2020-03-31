const FSBLReady = () => {
	try {
		// Do things with FSBL in here.
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const openPdf = (pdfUrl) =>{
	let data = {
		url: pdfUrl
	};

	let myChannels = FSBL.Clients.LinkerClient.getState().channels;
	if(myChannels.length >0){
		let channels = []
		myChannels.forEach(channel =>{
			channels.push(channel.name)
		})
		let linkedComp = FSBL.Clients.LinkerClient.getLinkedComponents({ channels: channels });
		if(linkedComp.length >1){
			FSBL.Clients.LinkerClient.publish({dataType: "pdf", data: pdfUrl});
		}else{
			spawnPdfJs(data)
		}
	}else{
		spawnPdfJs(data)
	}
}
window.openPdf = openPdf

const spawnPdfJs = (data) => {
	FSBL.Clients.LauncherClient.spawn("pdfJs", {
		position: 'relative', //position the window relative to this window
		left: 'adjacent',     //  to the right
		data: data
	}, function(err, response) {
		if(err) {
			FSBL.Clients.Logger.error("Error launching PDF viewer!",err);
		}
	});
}


if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
	setTimeout(()=>{
		let pdfNode = document.createElement("a");                
		pdfNode.setAttribute('href','#')
		pdfNode.innerHTML = 'CryptoIQ_Data_Sheet.pdf'
		pdfNode.onclick = () =>{
			openPdf('https://cdn2.hubspot.net/hubfs/2246990/_CryptoIQ/CryptoIQ_Data_Sheet.pdf')
		}
		document.getElementById('pdfList').appendChild(pdfNode)
		FSBL.UserNotification.alert("system", "ALWAYS", "MANIFEST-Error", 'New Research Found! CryptoIQ_Data_Sheet.pdf');
	},1000)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}