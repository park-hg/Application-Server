const Chat = require("../../../models/chat");

module.exports = (socket, event) => {
  socket.on(event, async (sender) => {
    try {
      const gitId = socket.userInfo.gitId;
      Chat.resetUnreadCount(sender, gitId);
    } catch (e) {
      console.log(`[ERROR]/resetUnreadCount/${e.name}/${e.message}`);
    }
  })
}