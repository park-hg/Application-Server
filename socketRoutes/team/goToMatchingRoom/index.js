const teamGameRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async () => {
    // userId가 방장인 경우만 emit
    try {
      const gitId = socket.userInfo.gitId;
      const exist = teamGameRoom.isExist(gitId)
      
      if (exist) {
        const roomId = await teamGameRoom.getId(gitId)
        socket.nsp.to(roomId).emit("goToMatchingRoom", gitId);
      }
    } catch (e) {
      console.log(`[ERROR]/goToMatchingRoom/${e.name}/${e.message}`);
    }
  })
}