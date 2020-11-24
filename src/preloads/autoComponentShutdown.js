// https://www.npmjs.com/package/cron
import { CronJob } from 'cron'
function runAutoShutdown() {

    /*
    Two different ways of setting custom data in config files.
    1) using the spawnData [Component] > window > data and getting it like this:
    FSBL.Clients.WindowClient.options.customData.spawnData.autoShutdown

    Note: the advantage to using the spawn data is that you can call it via FSBL.Clients.WindowClient.getSpawnData()

    2) using the custom key [Component] > custom and getting it like this:
    FSBL.Clients.WindowClient.options.customData.custom.autoShutdown
     */

    const { customData } = FSBL.Clients.WindowClient.options
    // provide some defaults in case they don't exist
    const {
        custom = { autoShutdown: false },
        spawnData = { autoShutdown: false } } = customData

    const { autoShutdown } = custom

    // Close this Finsemble Window
    const closeWindow = function () {
        finsembleWindow.close({
            removeFromWorkspace: true,
            closeWindow: true
        });
    }

    if (autoShutdown) {
        try {
            // every min - "00 * * * * *"
            const job = new CronJob(autoShutdown, () => {
                // TODO: add any other jobs here!
                FSBL.Clients.Logger.log(`Closing component ${FSBL.Clients.WindowClient.options.name}`)
                closeWindow()
            });

            job.start();
        } catch (error) {
            FSBL.Clients.Logger.error(err)
        }


    } else {
        console.warn("autoShutdown does not exist")
    }


}

// this code ensures that the FSBL library has been initialized
if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener("onReady", runAutoShutdown);
} else {
    window.addEventListener("FSBLReady", runAutoShutdown);
}
