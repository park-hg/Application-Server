const teamGameRoom = require("../../../models/teamroom");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (peerId, roomId) => {
    try {
      const gitId = socket.userInfo.gitId;
      const teamRoomId = await teamGameRoom.getId(roomId);
      
      teamGameRoom.setPeerId(roomId, gitId, peerId);
      const teamRoomPeerId = teamGameRoom.getPeerId(roomId);
      
      socket.nsp.to(teamRoomId).emit("getPeerId", gitId, teamRoomPeerId);
    } catch (e) {
      console.log(`[ERROR]/setPeerId/${e.name}/${e.message}`);
    }
  });
}