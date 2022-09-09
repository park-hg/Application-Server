const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (roomId) => {
    try {
      const userInfo = socket.userInfo;
      const teamRoomId = teamGameRoom.getId(roomId);
      
      socket.join(teamRoomId);
      let players = teamGameRoom.getPlayers(roomId);
      if (!(await players.map(item => item.gitId).includes(userInfo.gitId))) {
        teamGameRoom.addPlayer(roomId, userInfo);
        players = teamGameRoom.getPlayers(roomId);
      }
      socket.emit('setUsers', players);
    } catch(e) {
      console.log(`[ERROR]/getUsers/${e.name}/${e.message}`);
    }
  });
}