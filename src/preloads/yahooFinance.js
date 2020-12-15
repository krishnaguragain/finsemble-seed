/*
This preload works with Yahoo Finance - https://uk.finance.yahoo.com/quote/

This preload does two things:
1) When the user searches ticker symbols in the search box send the result over the linker to any other Finsemble components on the same channel. When dragging to another component it will use the current symbol from the URL.

2)Accept symbols and change the URL to match the symbol. Either by linker or drag and drop.


To make it work:
- Add a Yahoo Finance component (see the configs/application/components.json file)
- Ensure the preload is trusted (see configs/application/manifest-local.json under trustedPreloads)
- Add the preload to the Yahoo Finance component


Note: The code below relies on URLs and DOM elements. When using URLs and DOM selectors if the URL or DOM changes they will not work. This preload is just an example and if used in production would need upkeep.
*/



// create a colourful console.log message function to stand out over other messages
const log = (...logMessage) => console.log(`%c ${logMessage} `, 'background: #fff; color: #107c75')


function updateWindowTitle() {
    // mutationObserver is similar to an event handler, the difference is that it watches for changes in the DOM
    new MutationObserver((mutations) => {
        const titleText = mutations[0].target.text
        log(titleText);
        // when the window title changes update the Finsemble windowTitle to reflect
        FSBL.Clients.WindowClient.setWindowTitle(titleText)
    }).observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    );
}

// use the YahooFinance search bar when clicking enter send the symbol via linker
function shareSymbolLinker() {
    // if the user enters the ticker in the search box and presses enter send the ticker symbol via the linker
    document.body.addEventListener("keydown", function (event) {
        // only fire on the enter button
        if (event.keyCode === 13) {
            // check that the target is the search box
            if (event.target.id === "yfin-usr-qry") {
                // publish the symbol from the search to Finsemble linker
                FSBL.Clients.LinkerClient.publish({
                    dataType: "symbol",
                    data: event.target.value,
                });
            }
        }
    })

    // when the user clicks on the search results send the ticker via the linker
    document.body.addEventListener("click", function (event) {

        // the item in the search list that was clicked
        const searchResultListItem = event.target.closest("[data-test='srch-sym']")

        // only send data if the clicked element is a search result list element
        if (searchResultListItem) {
            // get only the ticker symbol from the list
            const symbolTitle = searchResultListItem.querySelector("[title]").title

            log(`Symbol -- ${symbolTitle}`)

            FSBL.Clients.LinkerClient.publish({
                dataType: "symbol",
                data: symbolTitle,
            });
        }


    })
}

// receive symbol data via Finsemble Linker
function receiveSymbolLinker() {
    // subscribe to anything with the type of symbol
    FSBL.Clients.LinkerClient.subscribe("symbol", data => {
        // change the page based on the data returned
        location.assign(`https://uk.finance.yahoo.com/quote/${data}`)
    })
}

// receive symbols via drag and drop and set the URL
function receiveDragAndDropData() {
    FSBL.Clients.DragAndDropClient.addReceivers({
        receivers: [
            {
                type: "symbol",
                // handler returns an error response
                handler: (err, { data }) => !err && window.location.assign(`https://uk.finance.yahoo.com/quote/${data.symbol}`)
            }
        ]
    })
}

// send the drag and drop data using the URL path data
function sendDragAndDropData() {
    FSBL.Clients.DragAndDropClient.setEmitters({
        emitters: [
            {
                type: "symbol",
                // the symbol is the last item in the URL
                data: () => window.location.pathname.split('/').pop()
            }
        ]
    })
}


function yahooPreload() {
    // https://uk.finance.yahoo.com/quote/AAPL
    log('YAHOO PRELOAD')
    updateWindowTitle()

    receiveSymbolLinker()
    shareSymbolLinker()

    receiveDragAndDropData()
    sendDragAndDropData()
}

// this code ensures that the FSBL library has been initialized
if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener("onReady", yahooPreload);
} else {
    window.addEventListener("FSBLReady", yahooPreload);
}