const User = require("../../../models/db/user");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (friendId) => {
    try {
      await User.unfollow(socket.userInfo.userId, friendId);
    } catch (e) {
      console.log(`[ERROR]/unFollowMember/${e.name}/${e.message}`);
    }
  });
}