const Interval = require('./interval');

let idx = 0;
const room = {};
const prevRoom = {};
const waitIdices = new Set();
/* room status: waiting, playing */

function getRoom(rooms) {
  for (let room of rooms) {
    if (room.includes('room')) {
      return room;
    }
  }
}

function setRoom(roomInfo) {
  if (roomInfo) {
    room[idx].players = roomInfo;
  }
}

function createRoom(userInfo, prevIdx, prevStatus) {
  console.log('prev idx', prevIdx);
  if (prevIdx !== undefined) {
    room[prevIdx] = {
      players: [userInfo],
      status: prevStatus
    }
  } else {
    if (room[idx]?.status === 'playing') {
      idx++;
    }
    console.log('room created', room);
    room[idx] = {
      players: [userInfo],
      status: 'waiting'
    }
    waitIdices.add(idx);

    console.log('room created', room);
  }

}

function deletePlayer(socket, userName, delay) {
  try {
    const myRoom = getRoom(socket.rooms);
    if (myRoom !== undefined) {
      const idx = myRoom.slice(4);
      console.log('solo room ', idx, room, room[idx]);
      room[idx].players = room[idx].players.filter(item => item.gitId !== userName);
  
      if (room[idx].players.length === 0) {
        if (room[idx].status === 'waiting') Interval.deleteInterval(myRoom, 'wait');
        else if (room[idx].status === 'playing') Interval.deleteInterval(myRoom, 'solo');
        if (delay === undefined) delete room[idx];
        
        waitIdices.delete(idx);
      }
    }

  } catch(e) {
    console.log(`[deletePlayer][ERROR] :::: log: ${e}`);
  }
}

function filterRoom(idx) {
  const temp = new Set()
  try {
    const unique = room[idx].filter(item => {
      const alreadyHas = temp.has(item.players.gitId)
      temp.add(item.players.gitId)
      return !alreadyHas
    });
    setRoom(unique);
  } catch (e) {
    console.log(`[filterRoom][ERROR] :::: log: ${e}`);
  }
}

function joinRoom(userInfo, to_idx) {
  try {
    if (to_idx !== undefined) {
      room[idx].players.push(userInfo);
    } else {
      room[to_idx].players.push(userInfo);
    }
  }
  catch(e) {
    console.log(e);
  }
}


function getStatus(idx) {
  return room[idx].status;
}


function setStatus(idx, status) {
  console.log('set status', room, idx, status);
  room[idx].status = status;

}

function increaseIdx() {
  idx += 1;
  return idx;
}

function getIdx() {
  return idx;
}

function getPrevRoom(gitId) {
  return prevRoom[gitId];
}

function setPrevRoom(gitId, socketrooms) {
  const prevIdx = getRoom(socketrooms).slice(4);
  const prevStatus = room[prevIdx].status;
  prevRoom[gitId] = {prevIdx, prevStatus};
}

function deletePrevRoom(gitId) {
  if (prevRoom[gitId] !== undefined) {
    delete prevRoom[gitId];
  }
}


module.exports = {
  room,
  waitIdices,
	getRoom,
  setRoom,
  getStatus,
  setStatus,
  deletePlayer,
  createRoom,
  filterRoom,
  joinRoom,
	increaseIdx,
  getIdx,
  getPrevRoom,
  setPrevRoom,
  deletePrevRoom,
  prevRoom
};