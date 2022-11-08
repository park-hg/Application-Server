const teamGameRoom = require("../../../models/teamroom");
const GameRoom = require("../../../models/gameroom");

/* event: exitWait */
module.exports = (socket, event) => {
  socket.on(event, async () => {
    // solo 일때 room{idx}형식.
    // team 일때 uuid형식 리턴 또는 undefined.

    let myRoom = await GameRoom.getRoom(socket.rooms);
    let teamRoom = await teamGameRoom.getRoom(socket.bangjang);

    if (myRoom === undefined && teamRoom === undefined) {
      return;
    }

    try {
      const gitId = socket.userInfo.gitId;
      // mode: solo
      if (myRoom?.includes("room")) {
        GameRoom.deletePlayer(socket, gitId);
        GameRoom.deletePrevRoom(gitId);
        if (GameRoom.room[myRoom?.slice(4)] !== undefined) {
          socket.to(myRoom).emit(event, GameRoom.room[myRoom?.slice(4)].players);
        }
      } 
      // mode: team
      else {
        // 팀전에서 방장이 exitWait call
        if (teamGameRoom.isExist(gitId)) {
          const roomId = await teamGameRoom.getId(gitId);
          socket.nsp.to(roomId).emit("exitTeamGame", gitId);
          teamGameRoom.deleteId(gitId);
        } else {
          // 팀전에서 팀원이 exitWait call
          if (socket.bangjang !== undefined) {
            const teamRoom = await teamGameRoom.getRoom(socket.bangjang);
            const players = await Promise.all (teamRoom.players.filter(player => {
              return player.userInfo.gitId !== gitId
            }))
    
            teamGameRoom.setPlayers(socket.bangjang, players);
            const newPlayers = teamGameRoom.getPlayers(socket.bangjang);
            socket.to(teamRoom.id).emit("enterNewUserToTeam", newPlayers)
            socket.bangjang = undefined;
          } 

          else {
            GameRoom.deletePlayer(socket, gitId);
            if (GameRoom.room[myRoom?.slice(4)] !== undefined) {
              socket.to(myRoom).emit(event, GameRoom.room[myRoom?.slice(4)].players);
            }
          }
        }
      }
      // 모든방에서 나가진 후 자기 private room 입장
      socket.leaveAll();
      socket.join(socket.id);
    } catch(e) {
      console.log(`[ERROR]/exitWait/${e.name}/${e.message}`);
    }
  });
};
