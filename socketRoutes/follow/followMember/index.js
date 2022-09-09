const User = require("../../../models/db/user");

module.exports = (socket, event) => {
  socket.on(event, async (friendId) => {
    try {
      await User.following(socket.userInfo.userId, friendId);
    } catch (e) {
      console.log(`[ERROR]/followMember/${e.name}/${e.message}`);
    }
  });
};