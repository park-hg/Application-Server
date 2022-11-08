const Code = require('../../../models/db/code');
const url = require('url');

exports.getCode = async (req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    let info = await Code.getCode(query.id);
    res.status(200).json({
      info,
      success: true
    });
  } catch(err) {
    res.status(409).json({
      success: false,
      message: err.message
    });
  }
};