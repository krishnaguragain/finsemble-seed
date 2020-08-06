const symphonyServiceTopic = 'symphonyService'
const symphonyQueryFunctionConfig = {
	getUserStreamList: 'getSymphonyUserStreamList',
	usersLookup: 'usersLookup',
	createMessage: 'createMessage',
	searchUsers: 'searchUsers',
	createIM: 'createIM',
	listConnections: 'listConnections',
	createRoom: 'createRoom',
	share: 'share'
}
let shareMsg = ''

const FSBLReady = () => {
	try {
		// Retrieve spawn data
		getSpawnData()

		// Retrieve existing symphony streams
		retrieveSymphonyStream().then(()=>{
			document.getElementById('sendBtn').disabled = false
		})

		document.getElementById('sendBtn').onclick = send
		document.getElementById('cancelBtn').onclick = cancel
		document.body.onblur = cancel
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const send = () => {
	if (shareMsg != '') {
		document.getElementById('sendBtn').disabled = true
		let selectedSids = document.querySelectorAll('#chatList option:checked');
		selectedSids.forEach((sidNode, key, arr)=>{
			let sid = sidNode.value
			FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
				function: symphonyQueryFunctionConfig.createMessage,
				sid: sid,
				msg: shareMsg
			}, function (error, queryResponseMessage) {
				if (!error) {
					let result = queryResponseMessage.data.result
					if(key == selectedSids.length-1){
						cancel()
					}
				}
			});
		})
	}
}

const cancel = () => {
	FSBL.Clients.WindowClient.close()
}

const getSpawnData = () => {
	var spawnData = FSBL.Clients.WindowClient.getSpawnData();
	if (Object.keys(spawnData).length != 0) {
		shareMsg = spawnData.shareMsg
		document.getElementById('shareText').value = shareMsg
	}
}

// Retrieve all existing Symphony Stream
const retrieveSymphonyStream = () => {
	return new Promise((resolve, reject) => {
		document.getElementById("chatList").options.length = 0;
		FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
			function: symphonyQueryFunctionConfig.getUserStreamList,
			streamTypes: [{
					"type": "IM"
				},
				{
					"type": "MIM"
				},
				{
					"type": "ROOM"
				}
			]
		}, (err, queryResponseMessage) => {
			if (!err) {
				let userStreamList = queryResponseMessage.data.userStreamList;
				let streamMembers = []
				userStreamList.forEach((userStream, key, arr) => {
					if (userStream.roomAttributes) {
						// Handle chart room
						addOption('chatList', userStream.roomAttributes.name, userStream.id)
					} else {
						// Handle IM / MIM
						// streamMembers only contains id
						// Have retrieve their displayName
						userStream.streamAttributes.members.forEach(member => {
							streamMembers.push(member)
						})
					}
				})
				// Retrieve member info by ids
				if (streamMembers.length != 0) {
					FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
						function: symphonyQueryFunctionConfig.usersLookup,
						userId: streamMembers
					}, (err, queryResponseMessage) => {
						if (!err) {
							let memberInfo = queryResponseMessage.data.memberInfo.users
							userStreamList.forEach((userStream, key, arr) => {
								if (!userStream.roomAttributes) {
									// Handle IM / MIM
									// streamMembers only contains id
									let memberDisplayName = []
									userStream.streamAttributes.members.forEach(member => {
										memberFullDetail = memberInfo.find(el => el.id == member)
										if (memberFullDetail) {
											memberDisplayName.push(memberFullDetail.displayName)
										}
									})
									addOption('chatList', memberDisplayName.toString(), userStream.id)
								}
							})
							resolve();
						}
					});
				}
			} else {
				console.log(err)
			}
		});
	})
}

const addOption = ((elementId, name, value) => {
	let chatsSelect = document.getElementById(elementId)
	let tmpOption = document.createElement("option");
	tmpOption.text = name;
	tmpOption.value = value;
	chatsSelect.add(tmpOption);
})

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}