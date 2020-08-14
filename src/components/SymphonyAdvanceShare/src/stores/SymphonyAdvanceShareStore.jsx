var Dispatcher = require("flux").Dispatcher;
Dispatcher = new Dispatcher();

var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var request = require("superagent");
const constants = {
  symphonyServiceTopic: "symphonyService",
  symphonyQueryFunctionConfig: {
    getUserStreamList: "getSymphonyUserStreamList",
    usersLookup: "usersLookup",
    createMessage: "createMessage",
    searchUsers: "searchUsers",
    createIM: "createIM",
    listConnections: "listConnections",
    createRoom: "createRoom",
    share: "share",
  },
};

var SymphonyAdvanceShareStore = assign({}, EventEmitter.prototype, {
  initialize: function () {
    //Get Spawn data
    var spawnData = FSBL.Clients.WindowClient.getSpawnData();
    if (Object.keys(spawnData).length != 0) {
      this.shareMsg = spawnData.shareMsg;
      this.emit("change");
    }

    // retrieve symphony streams
    FSBL.Clients.RouterClient.query(
      constants.symphonyServiceTopic,
      {
        function: constants.symphonyQueryFunctionConfig.getUserStreamList,
        streamTypes: [
          {
            type: "IM",
          },
          {
            type: "MIM",
          },
          {
            type: "ROOM",
          },
        ],
      },
      (err, queryResponseMessage) => {
        if (!err) {
          let userStreamList = queryResponseMessage.data.userStreamList;
          let streamMembers = [];
          let chatList = [];
          userStreamList.forEach((userStream, key, arr) => {
            if (userStream.roomAttributes) {
              // Handle chart room
              chatList.push({
                id: userStream.id,
                name: userStream.roomAttributes.name,
              });
            } else {
              // Handle IM / MIM
              // streamMembers only contains id
              // Have retrieve their displayName
              userStream.streamAttributes.members.forEach((member) => {
                streamMembers.push(member);
              });
            }
          });
          // Retrieve member info by ids
          if (streamMembers.length != 0) {
            FSBL.Clients.RouterClient.query(
              constants.symphonyServiceTopic,
              {
                function: constants.symphonyQueryFunctionConfig.usersLookup,
                userId: streamMembers,
              },
              (err, queryResponseMessage) => {
                if (!err) {
                  let memberInfo = queryResponseMessage.data.memberInfo.users;
                  userStreamList.forEach((userStream, key, arr) => {
                    if (!userStream.roomAttributes) {
                      // Handle IM / MIM
                      // streamMembers only contains id
                      let memberDisplayName = [];
                      userStream.streamAttributes.members.forEach((member) => {
                        let memberFullDetail = memberInfo.find(
                          (el) => el.id == member
                        );
                        if (memberFullDetail) {
                          memberDisplayName.push(memberFullDetail.displayName);
                        }
                      });
                      chatList.push({
                        id: userStream.id,
                        name: memberDisplayName.toString(),
                      });
                    }
                  });
                  this.streamList = chatList;
                  this.emit("change");
                }
              }
            );
          } else {
            this.streamList = chatList;
            this.emit("change");
          }
        } else {
          console.log(err);
        }
      }
    );
  },
  streamList: [],
  shareMsg: "",
  searchMemberResultList:[]
});

let Actions = {
  SEND: "SEND",
  SEARCHMEMBER: "SEARCHMEMBER",
};

Dispatcher.register((action) => {
  switch (action.type) {
    case Actions.SEND:
      let sids = action.sids;
      if (SymphonyAdvanceShareStore.shareMsg != "") {
        sids.forEach((sid, key, arr) => {
          FSBL.Clients.RouterClient.query(
            constants.symphonyServiceTopic,
            {
              function: constants.symphonyQueryFunctionConfig.createMessage,
              sid: sid,
              msg: SymphonyAdvanceShareStore.shareMsg,
            },
            function (error, queryResponseMessage) {
              if (!error) {
                let result = queryResponseMessage.data.result;
                if (key == sids.length - 1) {
                  FSBL.Clients.WindowClient.close();
                }
              }
            }
          );
        });
      }

      break;
    case Actions.SEARCHMEMBER:
      let keyword = action.keyword
      FSBL.Clients.RouterClient.query(constants.symphonyServiceTopic, {
        function: constants.symphonyQueryFunctionConfig.searchUsers,
        query: keyword
      }, (error, queryResponseMessage) => {
        if (!error) {
          let users = queryResponseMessage.data.users
          SymphonyAdvanceShareStore.searchMemberResultList = users
          SymphonyAdvanceShareStore.emit('searchMemberResultListChange')
        }
      });

      break;
  }
  return true;
});

// wait for FSBL to be ready before initializing.
const FSBLReady = () => {
  SymphonyAdvanceShareStore.initialize();
};

if (window.FSBL && FSBL.addEventListener) {
  FSBL.addEventListener("onReady", FSBLReady);
} else {
  window.addEventListener("FSBLReady", FSBLReady);
}

module.exports.Store = SymphonyAdvanceShareStore;
module.exports.SymphonyAdvanceShareDispatcher = Dispatcher;
module.exports.SymphonyAdvanceShareActions = Actions;
