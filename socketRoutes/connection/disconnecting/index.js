const User = require("../../../models/db/user");
const Auth = require("../../../models/auth");
const GameRoom = require("../../../models/gameroom");
const TeamRoom = require("../../../models/teamroom");
const UserSocket = require("../../../models/usersocket");

module.exports = async (socket, event) => {
  await socket.on(event, async () => {
    // disconnected when solo play
    // console.log('disconnecting', socket.token);
    // calling socket.rooms in try&catch yields UNDEFINED ROOM!!!
    const socketrooms = socket.rooms;
    try {
      if (socket.mode === 'solo') {
        GameRoom.setPrevRoom(socket.userInfo.gitId, socketrooms);
        GameRoom.deletePlayer(socket, socket.userInfo.gitId);

      }
      else if (socket.mode === 'team') {
        TeamRoom.setPrevRoom(socket);
        TeamRoom.deletePlayer(socket.bangjang, socket.userInfo.gitId);
      }

      if (socket.id !== undefined) {
        const followerList = await User.getFollowerList(socket.userInfo.userId);
        UserSocket.deleteSocketId(socket?.userInfo?.gitId)

        if (followerList !== undefined) {
          await Promise.all (followerList?.filter(friend => {
            if (UserSocket.isExist(friend)) {
              socket.to(UserSocket.getSocketId(friend)).emit("followingUserDisconnect", socket?.userInfo?.gitId);
            }
          }));
        }
      }
    } catch(e) {
      console.log(`[ERROR]/disconnecting/${e.name}/${e.message}`);
    }
  })
}