# Linker Tester

The Linker Tester can be used to test the linker functionality. It can send and receive messages based on topic/channel combination.

## Setup

Copy the _src/components/linker-tester_ folder to your project. Add _src/components.linker-tester/config.json_ to the application config. For example, it could be added to _configs/application/manifest-local.json_ using the following config:
```JSON
        "importConfig": [
            "$applicationRoot/configs/application/config.json",
            "$applicationRoot/components/linker-tester/config.json"
        ],
```

## Use
 
1. Launch the Linker Tester component
1. Put the Linker Tester on the same channel as the component you would like to test
1. Specify the linker channel in the **Channel** field

    **NOTE:** You can now listen to messages sent by other components, and any messages received will be displayed in the messages text field
1. Specify the data you would like to send over the linker in the **Data (JSON)** field
1. Click the **Linker Publish** button to publish the data on the linker channel
    **NOTE:** Any components on the specified linker channel should receive the data in the **Data (JSON)** field. 

### UI Description
- **Channel** - the linker channel on which messages will be send
- **Data (JSON)** - the data that will be published on the above linker channel
- **Linker Publish** - publishes the above data on the above linker channel
- **Clear Messages** - clears the messages text field
- Messages text field - Displays messages from the linker tester including setup and the messages received from the linker specified linker channel