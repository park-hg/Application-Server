const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    try {
      const userInfo = socket.userInfo;

      teamGameRoom.addPlayer(roomId, userInfo);
 
      const temp = new Set();
      
      const teamroom = teamGameRoom.getRoom(roomId);
      const teamRoomId = teamroom.id;

      const unique = teamroom.players.filter((item) => {
        const alreadyHas = temp.has(item.userInfo.gitId);
        temp.add(item.userInfo.gitId);
        return !alreadyHas;
      });
      teamGameRoom.setPlayers(roomId, unique);
      socket.join(teamRoomId);
      // console.log(`${userInfo.gitId} join ${roomId}'s room socketId is ${teamRoomId}`);
      socket.nsp
        .to(teamRoomId)
        .emit("enterNewUserToTeam", teamGameRoom.getPlayers(roomId));
      
      socket.bangjang = roomId;
    } catch (e) {
      console.log(`[ERROR]/acceptInvite/${e.name}/${e.message}`);
    }
  });
}