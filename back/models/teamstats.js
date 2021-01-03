const mongoose = require('mongoose');

const teamStatsSchema = new mongoose.Schema({
  matchid: {
    type: Number
  },
  Team_ID: {
    type: Number
  },
  bans: {
    type: Array
  },
  firstblood: {
    type: Boolean
  },
  firsttower: {
    type: Boolean
  },
  firstdragon: {
    type: Boolean
  },
  win: {
    type: Boolean
  },
  towerkills: {
    type: Number
  },
  participants: {
    type: Array
  }
});

module.exports = mongoose.model('TeamStats', teamStatsSchema);
