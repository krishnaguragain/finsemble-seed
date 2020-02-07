/**
 * Spawn multiple components, via an array of String componentTypes and a set of parameter 
 * to pass to LauncherClient.spawn. The spawned components are may also be added to a 
 * linker channel automatically.
 * 
 * @param {Array} componentsToSpawn An array of String componentTypes to spawn. 
 * @param {object} params Spawn parameters for the group, expected to include positioning (top/left) and sizing (width/height) information for the group.
 * @param {string} linkerGroup (Optional) The name of the linker group to add the spawned components to or 'auto' to automatically select an empty (or the least populated) linker group.
 * @returns {Array} An array of the responses from each spawn command [{err, response},...]
 * @example 
 * let toSpawn = ["Welcome Component","Welcome Component","Welcome Component"];
 * let promise = spawnTabbedGroup(toSpawn, {top: 100, left: 200, width: 400, height: 600}}, 'auto');
 */
const spawnTabbedGroup = function(componentsToSpawn, params, linkerGroup) {
	FSBL.Clients.Logger.log(`Spawning tabbed component group (${JSON.stringify(componentsToSpawn)}) with parameters`, params);
	
	if (linkerGroup == 'auto'){
		linkerGroup = pickLeastUsedLinkerGroup();
	}

	let componentParams = Object.assign({}, params);
	if (linkerGroup) { 
		if (!componentParams.data) { componentParams.data = {}; }
		componentParams.data.linker = { channels: [linkerGroup]};
	}
	return Promise.all(componentsToSpawn.map(function(aComp) {
		FSBL.Clients.Logger.info(`Spawning ${aComp} with options: ${JSON.stringify(componentParams, null, 2)}`);
		return FSBL.Clients.LauncherClient.spawn(aComp, componentParams);
	})).then(function(spawnResponses){
		FSBL.Clients.Logger.info("Spawn responses:", spawnResponses);
		let winIds = [];
		//collect up window identifiers
		spawnResponses.forEach((item,index) => {
			if (item.err) {
				FSBL.Clients.Logger.error("Error spawning " + componentsToSpawn[index] + ", err: ", item.err)
			}
			winIds[index] = item.response.windowIdentifier;
		});

		//form a tabbed window
		FSBL.Clients.Logger.info("Forming tabbed window");
		let tabbedParams = Object.assign({}, params);
		tabbedParams = Object.assign(componentParams, {
			windowType: "StackedWindow", 
			data: { windowIdentifiers: winIds }, 
			options: { newStack: true }
		});
		
		FSBL.Clients.LauncherClient.spawn("StackedWindow", tabbedParams);

		return spawnResponses;
	});
}

/**
 * Find the least populated linker group and return its name.
 * @returns {string} The name of the first, least populated Linker group.
 */
const pickLeastUsedLinkerGroup = function(){
    let groups = FSBL.Clients.LinkerClient.getAllGroups();
    let components = FSBL.Clients.LinkerClient.getLinkedWindows({});
    let used = {};
    components.forEach(comp => {
        comp.channels.forEach(channel => {
            if (used[channel]){ used[channel]++; }
            else { used[channel] = 1; }
        });
    });
    console.log("Linker group membership: ", used);
    let leastGroup = groups[0].name;
    let least = (used[groups[0].name] ? used[groups[0].name] : 0);
    for (let g=0; g<groups.length; g++) { 
        let groupName = groups[g].name;
        if (!used[groupName]) { 
            leastGroup = groupName; 
            break; 
        } else if (used[groupName] < least) {
            leastGroup = groupName; 
            least = used[groupName];
        }
    }
    return leastGroup;
};

export { spawnTabbedGroup as default };