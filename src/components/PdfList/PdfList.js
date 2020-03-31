
const FSBLReady = () => {
	try {
		FSBL.Clients.AuthenticationClient.getCurrentCredentials((err, credential)=>{
			if(err){
	
			}else{
				let pdfList = document.getElementById('pdfList')
				if(credential.credentials.username=='ethan'){
					let pdfNode = document.createElement("a");                
					pdfNode.setAttribute('href','#')
					pdfNode.innerHTML = 'Library_DataSheet_7_26_17.pdf'
					pdfNode.onclick = () =>{
						openPdf('https://cdn2.hubspot.net/hubfs/2246990/_ChartingLibrary/Library_DataSheet_7_26_17.pdf')
					}
					pdfList.appendChild(pdfNode)
					pdfList.appendChild(document.createElement("br"))
				}else if(credential.credentials.username=='jim'){
					let pdfNode = document.createElement("a");                
					pdfNode.setAttribute('href','#')
					pdfNode.innerHTML = 'Finsemble_DataSheet_2019.05.15.pdf'
					pdfNode.onclick = () =>{
						openPdf('https://cdn2.hubspot.net/hubfs/2246990/_Finsemble/DataSheets/Finsemble_DataSheet_2019.05.15.pdf')
					}
					pdfList.appendChild(pdfNode)
					pdfList.appendChild(document.createElement("br"))
				}
			}
		})
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

const follow = (list) => {
	document.getElementById('unfollow').style.display = "block";
	document.getElementById('follow').style.display = "none";
	FSBL.Clients.AuthenticationClient.getCurrentCredentials((err, credential)=>{
		if(err){

		}else{
			FSBL.Clients.RouterClient.transmit('UserActivity', {user:credential.credentials.username, action:{type:"follow", url: list}, timestamp: new Date()})
		}
	})
}
window.follow=follow

const unfollow = (list) => {
	document.getElementById('follow').style.display = "block";
	document.getElementById('unfollow').style.display = "none";
	FSBL.Clients.AuthenticationClient.getCurrentCredentials((err, credential)=>{
		if(err){

		}else{
			FSBL.Clients.RouterClient.transmit('UserActivity', {user:credential.credentials.username, action:{type:"unfollow", url: list}, timestamp: new Date()})
		}
	})
}
window.unfollow=unfollow


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
	},60000)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}