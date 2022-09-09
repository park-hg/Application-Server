const Chat = require("../../../models/chat");

module.exports = (socket, event) => {
  socket.on(event, async (sender) => {
    try {
      const gitId = socket.userInfo.gitId;
      const unreadCount = await Chat.getUnreadCount(sender, gitId);
      socket.emit('unreadMessage', { senderId: sender, count: unreadCount });
    } catch (e) {
      console.log(`[ERROR]/getUnreadMessage/${e.name}/${e.message}`);
    }
  });
}