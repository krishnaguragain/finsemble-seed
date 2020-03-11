# Finsemble Version Check Service

This recipe contains a service that reads the version of Finsemble at start up, then periodically checks to whether the 
deployed Finsemble version changes. If the deployed Finsemble version changes, the user is notified to restart the 
Finsemble application to use the new version. If the user clicks "Yes", or the time out expires, the Finsemble 
application is restarted.

## Configuration
The polling period defaults to one minute and the URL of the Finsemble core configuration defaults to 
`$applicationRoot/finsemble/configs/core/config.json`. Both of these values can be overridden via configuration:

```json
{
    "finsemble": {
        "FSBLVersionChecking": {
            "updatePeriod": 60000,
            "configURL": "https://localhost:3375/finsemble/configs/core/config.json"
        }
    }
}
```