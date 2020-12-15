const log = (...logMessage) => console.log(`%c ${logMessage} `, 'background: #fff; color: #107c75')

function runPreload() {
    // https://uk.finance.yahoo.com/quote/AAPL
    log('PRELOAD')

    FSBL.Clients.LinkerClient.subscribe("symbol", data => {
        location.assign(`https://uk.finance.yahoo.com/quote/${data}`)
    })

    function contextShareViaDom() {
        log('PRELOAD DOM LOADED')
        document.body.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                if (event.target.id === "yfin-usr-qry") {
                    FSBL.Clients.LinkerClient.publish({
                        dataType: "symbol",
                        data: event.target.value,
                    });
                    log(event.target.value)
                }
            }
        })
    }

    if (document.readyState === "complete") {
        // already fired, so run logic right away
        contextShareViaDom();
    } else {
        window.addEventListener("DOMContentLoaded", contextShareViaDom)
    }
}

// this code ensures that the FSBL library has been initialized
if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener("onReady", runPreload);
} else {
    window.addEventListener("FSBLReady", runPreload);
}