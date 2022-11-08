const teamGameRoom = require("../../../models/teamroom");
const uuid = require("uuid");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    console.log("current team room????", teamGameRoom.teamRoom);
    try {
      const userInfo = socket.userInfo;
      
      if (!(teamGameRoom.isExist(userInfo.gitId))) {
        console.log("refresh page SHOULD NOT be in here")
        const teamRoomId = uuid.v4();
        socket.join(teamRoomId);
        teamGameRoom.createRoom(userInfo.gitId, teamRoomId, userInfo)
        console.log("TEAMROOM after creation", JSON.stringify(teamGameRoom.teamRoom));
        return () => {
          clearInterval(interval);
        };
      } else {
        socket.join(teamGameRoom.getId(userInfo.gitId));
      }
    } catch(e) {
      console.log(`[ERROR]/createTeam/${e.name}/${e.message}`);
    }
  });
}