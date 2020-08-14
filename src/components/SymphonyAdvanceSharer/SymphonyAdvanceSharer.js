const FSBLReady = () => {
	try {
		document.getElementById('newDirectChatLink').onclick = openDirectChatModal
		document.getElementById('newChatRoomLink').onclick = openDirectChatModal
		document.getElementById('closeCreateDirectChatModalSpan').onclick = closeDirectChatModal
		document.getElementById('createChatRoomModal').onclick = closeChatRoomModal
		document.getElementById('memberSearchText').oninput= memberSearchTextOninput
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const memberSearchTextOninput = (e) => {
	console.log(e)
}

const openDirectChatModal = (e) => {
	document.getElementById('createDirectChatModal').style.display = "block";
}

const openChatRoomModal = (e) => {
	document.getElementById('createChatRoomModal').style.display = "block";
}

const closeDirectChatModal = (e) => {
	document.getElementById('createDirectChatModal').style.display = "none";
}

const closeChatRoomModal = (e) => {
	document.getElementById('createChatRoomModal').style.display = "none";
}

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}