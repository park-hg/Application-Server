const User = require("../../../models/db/user");
const Chat = require("../../../models/chat");
const UserSocket = require("../../../models/usersocket");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");

module.exports = (socket, event) => {
  socket.on(event, async (mode, roomId) => {
    try {
      socket.mode = mode;
      const userInfo = socket.userInfo
      const gitId = userInfo.gitId;

      if (mode === 'solo') {
        const prevRoom = GameRoom.getPrevRoom(gitId);
        if (prevRoom !== undefined) {
          const { prevIdx, prevStatus } = prevRoom;
          if (GameRoom.room[prevIdx] === undefined) {
            GameRoom.createRoom(userInfo, prevIdx, prevStatus);
          } else {
            GameRoom.joinRoom(userInfo, prevIdx);
          }
          socket.join(`room${prevIdx}`);
        }
      }
      else if (mode === 'team') {
        if (socket.bangjang === undefined) {
          socket.bangjang = roomId;
        }
        const prevRoomId = TeamRoom.getId(socket.bangjang);
        if (prevRoomId !== undefined) {
          socket.join(prevRoomId);
          let players = TeamRoom.getPlayers(socket.bangjang);
          if (!(await players.map(item => item.gitId).includes(gitId))) {
            TeamRoom.addPlayer(socket.bangjang, userInfo);
            players = TeamRoom.getPlayers(socket.bangjang);
          }
          socket.emit('setUsers', players);
        }
      }

      UserSocket.setSocketId(gitId, socket.id);

      const followerList = await User.getFollowerList(userInfo.userId);
      await Promise.all (followerList.filter(friend => {
        if (UserSocket.isExist(friend)) {
          socket.to(UserSocket.getSocketId(friend)).emit("followingUserConnect", gitId);
        }
      }))
      if (!Chat.isExist(gitId)) {
        Chat.setChatLog(gitId, {})
      }
    } catch (e) {
      socket.token = null;
      console.log(`[ERROR]/setGitId/${e.name}/${e.message}`);
    }
  });
}