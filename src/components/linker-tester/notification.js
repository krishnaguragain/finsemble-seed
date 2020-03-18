/***********************************************************************************************************************
	Copyright 2017-2020 by ChartIQ, Inc.
	Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
 **********************************************************************************************************************/
"use strict";

const init = () => {
    var title=document.getElementsByClassName("dialog-title")[0];
    var question=document.getElementsByClassName("dialog-question")[0]
    var button=document.getElementsByClassName("finsemble-button")[0];
    var spawnData=FSBL.Clients.WindowClient.getSpawnData();
    title.innerText=spawnData.title;
    question.innerText=spawnData.message;
    button.onclick=()=>{
        FSBL.Clients.WindowClient.close();
    }
}

if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener('onReady', init);
} else {
    window.addEventListener('FSBLReady', init);
};
