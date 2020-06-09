import spawnTabbedGroup from './spawnTabbedGroup'

const FSBLReady = () => {
	try {
		//get the spawner configuration provided in spawn data.
		let spawnerData = FSBL.Clients.WindowClient.getSpawnData();
		if (spawnerData && spawnerData.toSpawn) {
			//get the spawner's own config and position info (the spawned components will offset from that position)
			let spawnerConfig = FSBL.Clients.WindowClient.options.customData;
			let params = {
				left: spawnerConfig.window.left,
				top: spawnerConfig.window.top,
				width: spawnerConfig.window.width,
				height: spawnerConfig.window.height,
			}
			let linkerGroup = spawnerConfig.window.data.linkerGroup;

			spawnTabbedGroup(spawnerData.toSpawn, params, spawnerData.linkerGroup)
			.then(function (spawnResponses) {
				FSBL.Clients.WindowClient.close({ removeFromWorkspace: true, closeWindow: true });	
			});
		} else {
			FSBL.Logger.error("Received no spawner data, spawnerData: ", spawnerData);
			FSBL.Clients.WindowClient.close({ removeFromWorkspace: true, closeWindow: true });
		}
		
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}