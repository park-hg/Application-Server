const GameRoom = require("../../../models/gameroom");
const Interval = require("../../../models/interval");
const Auth = require("../../../models/auth");

// waitGame
module.exports = (socket, event) => {
  socket.on(event, async () => {
    try {
      const userInfo = socket.userInfo;
      let idx = GameRoom.getIdx();

      // 새 개인전룸 생성
      if (Object.keys(GameRoom.room).length === 0 || GameRoom.room[idx] === undefined) {
        // 이전에 연결이 끊긴적이 있는지 확인
        const prevRoom = GameRoom.getPrevRoom(userInfo.gitId);
        if (prevRoom !== undefined) {
          // 연결이 끊겼다면 전 게임정보를 로드
          const { prevIdx, prevStatus } = prevRoom;
          idx = prevIdx;
          GameRoom.createRoom(userInfo, prevIdx, prevStatus);
        } else {
          GameRoom.createRoom(userInfo);
          socket.join(`room${idx}`);
  
          // 시간제한 설정
          let timeLimit = new Date();
          timeLimit.setMinutes(timeLimit.getMinutes() + 3);
          Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait")
        }
      } 

      // 기존에 있던 개인전 대기룸에 들어감
      else if (GameRoom.room[idx].players.length < 8 && GameRoom.room[idx].status === 'waiting') {
        // 이전에 연결이 끊긴적이 있는지 확인
        const prevRoom = GameRoom.getPrevRoom(userInfo.gitId);
        if (prevRoom !== undefined) {
          // 연결이 끊겼다면 전 게임정보를 로드
          const { prevIdx, prevStatus } = prevRoom;
          GameRoom.joinRoom(userInfo, prevIdx);
        } else {
          GameRoom.joinRoom(userInfo);
        }
        const temp = new Set()
        const unique = GameRoom.room[idx].players.filter(item => {
          const alreadyHas = temp.has(item.gitId)
          temp.add(item.gitId)
          return !alreadyHas
        })

        GameRoom.setRoom(unique);
        socket.join(`room${idx}`);
      }
      
      else {
        idx = GameRoom.increaseIdx();
        GameRoom.createRoom(userInfo);
        socket.join(`room${idx}`);

        let timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 3);
        Interval.makeInterval(socket, `room${idx}`, timeLimit, "wait");
      }
      console.log(idx, GameRoom.room[idx], GameRoom.room);
      socket.nsp.to(`room${idx}`).emit('enterNewUser', GameRoom.room[idx].players);
    } catch(e) {
      console.log(`[ERROR]/waitGame/${e.name}/${e.message}`);
    }
  })
}