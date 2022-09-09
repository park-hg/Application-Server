const Chat = require("../../../models/chat");
const Auth = require("../../../models/auth");

module.exports = (socket, event) => {
  socket.on(event, async (receiver) => {
    try {
      const gitId = socket.userInfo.gitId;
      const myChatLogs = Chat.receiveChat(gitId, receiver);
      if (myChatLogs !== false) {
        socket.emit("receiveChatMessage", myChatLogs);
      }
    } catch (e) {
      console.log(`[ERROR]/getChatMessage/${e.name}/${e.message}`);
    }
  });
}