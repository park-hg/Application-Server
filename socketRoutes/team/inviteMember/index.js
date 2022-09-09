const UserSocket = require("../../../models/usersocket");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (friendGitId) => {
    try {
      const userInfo = socket.userInfo;
      socket.to(UserSocket.getSocketId(friendGitId)).emit("comeon", userInfo);
    } catch (e) {
      console.log(`[ERROR]/inviteMember/${e.name}/${e.message}`);
    }
  });
}