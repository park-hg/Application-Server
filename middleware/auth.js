const User = require('../models/db/user');
const jwt = require('jsonwebtoken');

const SECRETKEY = process.env.JWT_SECRET;
const EXPIRESIN = process.env.EXPIRESIN;
const ISSUER = process.env.ISSUER;

const cookieConfig = {
  httpOnly: true,
  // secure: true
}

async function getGithubUser(access_token) {
  const req = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `bearer ${access_token}`
    }
  })
  const data = await req.json()
  return data
}

module.exports = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.cookies.jwt, SECRETKEY);
    return next();
  } catch(e) {
    if (e.name === 'TokenExpiredError') {
      // github access token을 refresh token으로 사용(유효시간 무제한).
      const githubData = getGithubUser(res.cookies.refreshToken);
      if (githubData) {

        let user;
        if (user = await User.isExist(githubData.id)) {

          const newToken = jwt.sign(
            {
              userId: user._id,
              gitId: user.gitId,
              nodeId: user.nodeId,
              avatarUrl: user.avatarUrl,
            }, 
            SECRETKEY, 
            {
              expiresIn: EXPIRESIN,
              issuer: ISSUER,
            }
          )
          res.cookie('jwt', newToken, cookieConfig);
          res.cookie('myId', user._id, cookieConfig);
          return res.status(200).json({ success: true });
        }
      }
      return res.status(419).json({
        success: false,
        message: 'Token Expired'
      });
   } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid Token'
      });
    }
  }
}