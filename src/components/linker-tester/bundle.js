/***********************************************************************************************************************
	Copyright 2017-2020 by ChartIQ, Inc.
	Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
 **********************************************************************************************************************/
const Linker = FSBL.Clients.LinkerClient;
const Logger = FSBL.Clients.Logger;
const WindowClient = FSBL.Clients.WindowClient;
const DragAndDrop = FSBL.Clients.DragAndDropClient;
const DialogManager = FSBL.Clients.DialogManager;
const Launcher = FSBL.Clients.LauncherClient;


import "@babel/polyfill";

(() => {
	"use strict";

	document.addEventListener("DOMContentLoaded", () => {
		// #region Elements
		const dataType = document.getElementById("dataType");
		const data = document.getElementById("data");
		const LPButton = document.getElementById("LPublish");
		const clearButton = document.getElementById("clear");
		const received = document.getElementById("received");
		const windowId = WindowClient.getCurrentWindow().name;
		// #endregion

		let currentDataType = dataType.value;
		let publishSent = false
		let subscribeId;

		/**
		 * Function to handle data received over the linker.
		 * 
		 * @param {any} data 
		 */
		const printOutput = (title, printData) => {
			// Add received data to text field.
			const titleDiv = document.createElement("div");
			titleDiv.className = "title";
			titleDiv.appendChild(document.createTextNode(title));

			const dataBody = document.createElement("pre");
			dataBody.innerText = printData ? JSON.stringify(printData, null, 2) : ""

			received.appendChild(titleDiv);
			received.appendChild(dataBody);
		};

		function sendMessage(method, message, inclTopic) {
			// Build object to publish
			const obj = {
				data: data.value
			}
			if (inclTopic === true) {
				obj.topic = dataType.value
			}
			try {
				obj.data = JSON.parse(obj.data);
			}
			catch (e) {
				return Launcher.spawn("AlertDialog", { ephemeral: true, data: { message: "Invalid JSON Object.", title: "Syntax Error" } });
			}
			// Print it to the output
			printOutput(message, obj);

			method(obj.data);

		}//header.originatedHere

		function LinkerPublish(json) {
			Linker.publish({ dataType: dataType.value, data: json })
		}

		function clearDisplay() {
			received.innerText = "";
		}

		function dropHandler(err, response) {
			if (err) {
				return Logger.error("Drag and drop failed:", err);
			}
			printOutput("Data Received From the Drag and Drop Client: ", response);
		}

		function linkerSubscribeCb(responseData, header) {
			if (header.originatedHere()) {
				return;
			}
			printOutput("Linker Publish Received :", responseData);
		}

		async function communicationSetup() {
			//Setup up all responders, subscribers, and listeners for Router and Linker Clients.
			currentDataType = dataType.value;
			await Linker.subscribe(currentDataType, linkerSubscribeCb)
			printOutput("Linker Subscribed to Channel " + currentDataType + "...");
		}

		const init = async () => {
			// Subscribe to default topic, and add listeners for all message types.
			DragAndDrop.addReceivers({
				receivers: [
					{
						type: /.*/,
						handler: dropHandler
					}
				]
			})
			DragAndDrop.setEmitters({
				emitters: [
					{
						type: /.*/,
						data: () => JSON.parse(data.value)
					}
				]
			})

			communicationSetup();
			// Listen for data type changes
			dataType.onblur = () => {
				// Did dataType change?
				if (currentDataType != dataType.value) {
					// Unsubscribe from old dataType

					Linker.unsubscribe(currentDataType);

					communicationSetup();
				}
			};

			// Listen for click event to end data
			LPButton.onclick = () => sendMessage(LinkerPublish, "Publishing Data with Linker: ", true);
			clearButton.onclick = () => clearDisplay();
			received.ondrop = (event) => {
				DragAndDrop.drop(event);
			}
			data.ondragstart = (event) => {
				DragAndDrop.dragStartWithData(event, JSON.parse(data.value))
			}
		};

		if (window.FSBL && FSBL.addEventListener) {
			FSBL.addEventListener('onReady', init);
		} else {
			window.addEventListener('FSBLReady', init);
		}
	});
})()