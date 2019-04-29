/**
 * Preload that updates the Finsemble theme at runtime.
 */
(() => {
    /**
     * The name of the theme store.
     */
    const storeName = "themeStore";

    /** 
     * The name of the window that will create the theme store.
     * 
     * NOTE: With authentication, the store would be created and populated from dynamic configuration, so the hack of
     * Creating the store in a specific window would go away.
     */
    const storeOwner = "Toolbar-1-Finsemble";

    /**
     * Handle to the theme store.
     */
    let themeStore;

    /**
     * Converts a CSS String into an object.
     * 
     * @param {string} cssStr CSS String
     */
    const cssStringToObject = (cssStr) => {
        // Get inner CSS string
        const innerCSS = cssStr.match(/\{\s+(.*)\s+\}.*/)[1]

        // Map CSS to an object
        const cssObj = innerCSS
            // Get each variable by splitting on ;
            .split(";")
            // Removed null or empty lines
            .filter((line) => line.includes(":"))
            // Convert CSS line into a property
            .reduce((prev, line) => {
                const parts = line.split(":");
                const key = parts[0].trim();
                const value = parts[1].trim();

                prev[key] = value;

                return prev;
            }, {});
        
        return cssObj;
    }

    /**
     * Gets the default theme from the running system.
     * 
     * Based on: https://stackoverflow.com/a/45763800/5397392
     */
    const getDefaultTheme = () => {
        // Get array of style sheets
        const root = [].slice.call(document.styleSheets)
            // Remove sheets without CSS rules
            .filter((styleSheet) => styleSheet.cssRules)
            // Get array of CSS Rules
            .reduce((prev, styleSheet) => prev.concat([].slice.call(styleSheet.cssRules)), [])
            // Remove CSS Rules that aren't root
            .filter((cssRule) => cssRule.selectorText === ":root")
            // Convert the CSS strings into a hashmap
            .reduce((prev, cssRule) => Object.assign(prev, cssStringToObject(cssRule.cssText)), {});
        
        return root;
    }

    /**
     * Initializes the store.
     * 
     * This either creates the store if the loading window is the first toolbar, or it fetches the already created store
     * from the <code>DistributedStoreClient</code>.
     */
    const initializeStore = () => {
        if (themeStore) {
            // Already initialized
            return;
        }

        const name = FSBL.Clients.WindowClient.getCurrentWindow().name;
        if (name === storeOwner) {
            FSBL.Clients.Logger.debug("Creating theming store");

            // If the first toolbar, create the distributed store.
            const values = getDefaultTheme();

            const params = { store: storeName, global: true, values: values };
            FSBL.Clients.DistributedStoreClient.createStore(params, fetchStoreCB);
        } else {
            FSBL.Clients.Logger.debug("Fetching theming store");

            // Get the already created distributed store
            FSBL.Clients.DistributedStoreClient.getStore({ store: storeName }, fetchStoreCB);
        }
    }

    /**
     * Handles the themeListener callback.
     * @param {*} err The error object.
     */
    const themeListenerCB = (err) => {
        if (err) {
            FSBL.Clients.Logger.error(err);
        } else {
            FSBL.Clients.Logger.debug("Theme listener successfully added.");
        }
    }

    /**
     * Handles changes to the theme store.
     * 
     * @param {*} err The error object
     * @param {*} data The data object
     */
    const themeChangeHandler = (err, data) => {
        if (err) {
            return FSBL.Clients.Logger.error(err);
        }

        // Get them from returned data
        const theme = data.value.values;
        FSBL.Clients.Logger.debug("Theme change received: ", theme);

        // Apply theme to window
        Object.keys(theme).forEach((key) => document.documentElement.style.setProperty(key, theme[key]))
    }

    /**
     * Handles the <code>createStore</code> and <code>getStore</code> callbacks.
     * 
     * @param {*} err Error object. Null if no error.
     * @param {*} storeObject The created store object.
     */
    const fetchStoreCB = (err, storeObject) => {
        if (err) {
            return FSBL.Clients.Logger.error(err);
        }

        FSBL.Clients.Logger.debug("Theming store retrieved. Listening for changes.");

        // Save store object to script level variable for later use.
        themeStore = storeObject;

        // Listen for theme changes
        themeStore.addListener(themeChangeHandler, themeListenerCB);
    }

    FSBL.addEventListener("onReady", initializeStore);
})()