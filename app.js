const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const db = require("./lib/db");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const Auth = require("./models/auth");
const SocketIO = require("socket.io");
const SocketRoutes = require("./socketRoutes");

const PORTNUM = 3000;

db.connect();

const io = SocketIO(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  }
});


app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/", require("./routes/"));


io.use(async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.request.headers?.cookie);
    const token = cookies['jwt'];
    const payload = await Auth.verify(token);
    if (!payload) {
      return next(new Error('Authentication error'));
    }
    socket.userInfo = payload;
    next();
  } catch(e) {
    console.log(e);
  }
})

io.on("connection", (socket) => {
  socket.onAny(e => {
    console.log(`SOCKET EVENT::::::${e}`);
  });
  // Connection
  SocketRoutes.connection.setGitId(socket, SocketRoutes.connection.event.setGitId);
  SocketRoutes.connection.disconnecting(socket, SocketRoutes.connection.event.disconnecting);
  SocketRoutes.connection.exitWait(socket, SocketRoutes.connection.event.exitWait);

  // Solo
  SocketRoutes.solo.waitGame(socket, SocketRoutes.solo.event.waitGame);
  SocketRoutes.solo.startGame(socket, SocketRoutes.solo.event.startGame);
  SocketRoutes.solo.submitCode(socket, SocketRoutes.solo.event.submitCode);
  SocketRoutes.solo.getRanking(socket, SocketRoutes.solo.event.getRanking);
  SocketRoutes.solo.getRoomId(socket, SocketRoutes.solo.event.getRoomId);

  // Team
  SocketRoutes.team.getTeamRanking(socket, SocketRoutes.team.event.getTeamRanking);
  SocketRoutes.team.createTeam(socket, SocketRoutes.team.event.createTeam);
  SocketRoutes.team.inviteMember(socket, SocketRoutes.team.event.inviteMember);
  SocketRoutes.team.acceptInvite(socket, SocketRoutes.team.event.acceptInvite);
  SocketRoutes.team.getUsers(socket, SocketRoutes.team.event.getUsers);
  SocketRoutes.team.startMatching(socket, SocketRoutes.team.event.startMatching);
  SocketRoutes.team.goToMatchingRoom(socket, SocketRoutes.team.event.goToMatchingRoom);
  SocketRoutes.team.submitCodeTeam(socket, SocketRoutes.team.event.submitCodeTeam);
  SocketRoutes.team.getTeamInfo(socket, SocketRoutes.team.event.getTeamInfo);
  SocketRoutes.team.shareJudgedCode(socket, SocketRoutes.team.event.shareJudgedCode);
  SocketRoutes.team.setPeerId(socket, SocketRoutes.team.event.setPeerId);

  // Follow
  SocketRoutes.follow.followMember(socket, SocketRoutes.follow.event.followMember);
  SocketRoutes.follow.getFollowingList(socket, SocketRoutes.follow.event.getFollowingList);
  SocketRoutes.follow.unFollowMember(socket, SocketRoutes.follow.event.unFollowMember);

  // Chat
  SocketRoutes.chat.sendChatMessage(socket, SocketRoutes.chat.event.sendChatMessage);
  SocketRoutes.chat.getChatMessage(socket, SocketRoutes.chat.event.getChatMessage);
  SocketRoutes.chat.getUnreadMessage(socket, SocketRoutes.chat.event.getUnreadMessage);
  SocketRoutes.chat.resetUnreadCount(socket, SocketRoutes.chat.event.resetUnreadCount);
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});