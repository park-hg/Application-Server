const User = require('../../../models/db/user');
const url = require('url');

require("dotenv").config();

exports.getUserInfo = async(req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    let UserInfo;
    if (query.id === 'getmyinformation') {
      UserInfo = await User.getUserInfo(req.cookies.myId);
    } else {
      UserInfo = await User.getUserInfo(query.id);
    }
    res.status(200).json({
      UserInfo,
      success: UserInfo ? true : false
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}

exports.searchUser = async(req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    const UserInfo = await User.getUserInfoByGitId(query.gitid);
    res.status(200).json({
      UserInfo,
      success: UserInfo ? true : false
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}

exports.pagingRanking = async (req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    const ranking = await User.paging(query.start, query.count);
    res.status(200).json({
      ranking,
      next: ranking.length === parseInt(query.count),
      success: true 
    })
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
}
